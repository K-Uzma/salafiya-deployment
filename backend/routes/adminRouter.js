const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/auth");
const { dateConversion } = require("../utils/common-functions");
const authMiddleware = require("../middleware/auth");
const mysql = require("mysql");

//adminLogin
router.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Retrieve user details using the username
    const [rows] = await pool.execute("CALL CheckAdminLogin(?)", [username]);
    const user = rows[0][0];

    if (!user) {
      return res.status(401).json({ error: "Invalid Username!" });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(
      password?.trim(),
      user?.sca_password.trim()
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password!" });
    }

    // Generate token upon successful login
    const token = generateToken(user?.sca_id, "sal_cam_admin");

    // Prepare dynamic fields for updating last login details
    const formattedDate = dateConversion();
    const dynamicFieldsValues = `sca_last_login = "${formattedDate}"`;
    const id = `sca_id = '${user?.sca_id}'`;
    await pool.execute("CALL UpdateAdmin(?, ?)", [dynamicFieldsValues, id]);

    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

//adminDetailByID
router.get(
  "/api/admin/admin-detail-by-id",
  authMiddleware,
  async (req, res) => {
    const id = req?.user?.id;
    try {
      // Retrieve admin details using the id
      const [rows] = await pool.execute("CALL GetAdminDetailById(?)", [id]);
      const details = rows[0] ? rows[0][0] : {};

      // Remove scai_id & sca_id if they exist
      if (details) {
        delete details.scai_id;
        delete details.sca_id;
      }

      return res.status(200).json(details);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

//insertNewDonor
router.post("/api/admin/insert-new-donor", authMiddleware, async (req, res) => {
  try {
    const formattedDate = dateConversion();

    //Insert in admin donor table
    const data = {
      ...req.body,
      donation_date: formattedDate,
    };

    const paramNamesString = Object.keys(data).join(", ");
    const paramValuesString = Object.values(data)
      .map((value) =>
        typeof value === "string"
          ? `"${mysql.escape(value).slice(1, -1)}"`
          : `'${value}'`
      )
      .join(", ");

    await pool.execute("CALL InsertAdminDonors(?, ?, @inserted_id_result)", [
      paramNamesString,
      paramValuesString,
    ]);

    return res.status(200).json({
      message: "Donor Added Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

//donorsList
router.get("/api/admin/donors-list", authMiddleware, async (req, res) => {
  try {
    // Retrieve donors list from admin donor table
    const [rows] = await pool.execute("CALL GetDonorsList()");

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

//donorDetailByID
router.get(
  "/api/admin/donor-detail-by-id/:id",
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    try {
      // Retrieve donor details using the id
      const [rows] = await pool.execute("CALL GetDonorsDetailById(?)", [id]);
      const details = rows[0] ? rows[0][0] : {};

      return res.status(200).json(details);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

//deleteDonorByID
router.delete(
  "/api/admin/delete-donor-by-id/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const id = req.params.id;

      const del1 = `scaid_id = '${id}'`;
      await pool.execute("CALL DeleteAdminDonors(?)", [del1]);

      return res.status(200).json({
        message: "Donor Deleted Successfully!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
);

module.exports = router;

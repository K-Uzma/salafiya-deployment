const mysql = require("mysql");
const moment = require("moment");

const dateConversion = () => {
  // const currentDate = new Date();
  // const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
  const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  return formattedDate;
};

function convertObjectToProcedureParams(data) {
  // Check if data is defined and not null
  if (data === undefined || data === null) {
    return null; // or return a default value if needed
  }

  // Extract the keys and values from the object
  const entries = Object.entries(data);

  // Convert each entry to the desired format
  const formattedEntries = entries.map(([key, value]) => {
    // Check if the value is a string
    if (typeof value === "string") {
      return `${key} = "${mysql.escape(value).slice(1, -1)}"`;
    } else {
      return `${key} = '${value}'`;
    }
  });

  // Join the formatted entries with commas
  const formattedParams = formattedEntries.join(", ");

  return formattedParams;
}

module.exports = {
  dateConversion,
  convertObjectToProcedureParams,
};

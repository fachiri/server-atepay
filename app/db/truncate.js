require('dotenv').config();
const db = require("../models");

// Function to delete rows in dependent tables
async function deleteRowsInDependentTables() {
  try {
    await db.user_roles.destroy({ truncate: true, cascade: false });
    // Add more dependent tables deletion here if needed.
    console.log("Rows in dependent tables have been deleted successfully.");
  } catch (error) {
    console.error("Error deleting rows in dependent tables:", error);
  }
}

// Function to truncate all main tables
async function truncateMainTables() {
  try {
    // Get an array of all main models from the 'db' object.
    const mainModels = [
      db.user,
      db.role,
      db.slider,
      db.page,
      db.bill,
      db.payment,
      // Add more main models here if needed.
    ];

    // Truncate each main table one by one.
    for (const model of mainModels) {
      await model.destroy({ truncate: true, cascade: false });
      console.log(`Table ${model.name} has been truncated (emptied) successfully.`);
    }

    console.log("All main tables have been truncated (emptied) successfully.");
  } catch (error) {
    console.error("Error truncating main tables:", error);
  }
}

// Usage example:
(async () => {
  try {
    // Connect to the database.
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Delete rows in dependent tables first.
    await deleteRowsInDependentTables();

    // Truncate all main tables.
    await truncateMainTables();

    // Close the database connection.
    await db.sequelize.close();
    console.log("Database connection has been closed.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

const mongoose = require("mongoose");
require("dotenv").config();

// Import model(s)
const Role = require("../models/roles");
const User = require("../models/user");

const roles = [
  { title: "admin", description: "Administrator with full access" },
  { title: "user", description: "Regular user with limited access" },
  { title: "read_only", description: "User with read-only access" },
];

async function migrateRolesAndAssignDefaultRole() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connected to the database.");

    // Insert roles into the roles collection
    const existingRoles = await Role.find({});
    if (existingRoles.length > 0) {
      console.info("Roles already exist. Skipping role migration.");
    } else {
      await Role.insertMany(roles);
      console.info("Roles have been successfully migrated.");
    }

    const userRole = await Role.findOne({ title: "user" });
    if (!userRole) {
      throw new Error('The "user" role was not found in the roles collection.');
    }

    const updatedUsers = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: userRole._id } }
    );

    console.info(
      `${updatedUsers.modifiedCount} users have been assigned the default "user" role.`
    );
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.info("Disconnected from the database.");
  }
}

// Run the migration
migrateRolesAndAssignDefaultRole();

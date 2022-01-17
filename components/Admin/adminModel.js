const mongoose = require("mongoose");

const adminAccountSchema = mongoose.Schema({
  username: { type: String },
  name: { type: String },
  email: { type: String, require: true },
  password: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  createdDate: {tyoe: Date},
});

const adminRoleSchema = mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, require: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, require: true },
});

const roleSchema = mongoose.Schema({
  roleName: { type: String, require: true },
});

const AdminAccount = mongoose.model(
  "adminAccounts",
  adminAccountSchema,
  "adminAccounts"
);
const AdminRole = mongoose.model("adminRoles", adminRoleSchema, "adminRoles");
const Role = mongoose.model("roles", roleSchema, "roles");

module.exports = {
  AdminAccount,
  AdminRole,
  Role,
};

// --- Commit:  add adminModel and add isBlock into userModel (ca3b745) ---

// const adminSchema = mongoose.Schema({
//   username: { type: String, require: true },
//   password: { type: String },
//   email: { type: String, require: true },
//   dateCreate: {type: Date}
// })

// module.exports = mongoose.model("admins", adminSchema)

// --- Commit:  add adminModel and add isBlock into userModel (ca3b745) ---
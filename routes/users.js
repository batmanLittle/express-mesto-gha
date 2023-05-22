const router = require("express").Router();
const {
  getUsers,
  getUsersById,
  createUsers,
  updateUser,
} = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:userId", getUsersById);

router.post("/users", createUsers);

router.patch("/users/me", updateUser);
module.exports = router;
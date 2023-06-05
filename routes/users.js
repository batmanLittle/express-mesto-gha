const router = require("express").Router();
const {
  getUsers,
  getUsersById,
  getMe,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/me", getMe);

router.get("/users/:userId", getUsersById);

router.patch("/users/me/avatar", updateAvatar);

router.patch("/users/me", updateUser);

module.exports = router;

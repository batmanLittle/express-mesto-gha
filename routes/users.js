const router = require("express").Router();
const {
  getUsers,
  getUsersById,
  getMe,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

const {
  getUsersByIdValid,
  updateUserValid,
  updateAvatarValid,
} = require("../middlewares/validation");

router.get("/users", getUsers);
router.get("/users/me", getMe);

router.get("/users/:userId", getUsersByIdValid, getUsersById);

router.patch("/users/me/avatar", updateAvatarValid, updateAvatar);

router.patch("/users/me", updateUserValid, updateUser);

module.exports = router;

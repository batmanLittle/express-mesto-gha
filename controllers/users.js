const usersModel = require("../models/user");

const getUsers = (req, res) => {
  usersModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUsersById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  usersModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  usersModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      }
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUser,
};

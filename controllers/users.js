const usersModel = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = (req, res) => {
  usersModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(SERVER_ERROR).send({
        message: "Внутренняя ошибка сервера",
      });
    });
};

const getUsersById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Пользователь с указанным _id не найден",
        });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
        });
      }
      return res.status(SERVER_ERROR).send({
        message: "Внутренняя ошибка сервера",
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
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
        });
      } else {
        return res.status(SERVER_ERROR).send({
          message: "Внутренняя ошибка сервера",
        });
      }
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
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
        });
      } else {
        return res.status(SERVER_ERROR).send({
          message: "Внутренняя ошибка сервера",
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  usersModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      }
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
        });
      } else {
        return res.status(SERVER_ERROR).send({
          message: "Внутренняя ошибка сервера",
        });
      }
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUser,
  updateAvatar,
};

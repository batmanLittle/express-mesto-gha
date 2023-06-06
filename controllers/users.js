const usersModel = require("../models/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Auth = require("../utils/ Auth");
const BadRequest = require("../utils/BadRequest");
const NotFound = require("../utils/NotFound");
const Conflict = require("../utils/Conflict");

const getUsers = (req, res, next) => {
  usersModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  usersModel
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Пользователь с указанным _id не найден"));
      }
    })
    .catch(next);
};

const getUsersById = (req, res, next) => {
  usersModel
    .findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Пользователь с указанным _id не найден"));
      }
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      usersModel
        .create({ name, about, avatar, email, password: hash })
        .then(({ name, about, avatar, email }) => {
          res.status(201).send({ name, about, avatar, email });
        })
        .catch((err) => {
          if (err.name === "MongoServerError") {
            next(new Conflict("Такой пользаватель уже существует"));
          }
          if (err.name === "ValidationError") {
            next(new BadRequest("Переданы некорректные данные"));
          }
        })
    )
    .catch(next);
};

const updateUser = (req, res, next) => {
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
        next(new BadRequest("Переданы некорректные данные"));
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
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
        next(new BadRequest("Переданы некорректные данные"));
      }
    })
    .catch(next);
};

login = (req, res, next) => {
  const { email, password } = req.body;

  return usersModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "Error") {
        next(new Auth(" Неправильная почта или пароль"));
      }
    })
    .catch(next);
};

module.exports = {
  getMe,
  login,
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  updateAvatar,
};

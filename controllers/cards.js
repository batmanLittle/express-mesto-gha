const cardModel = require("../models/cards");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../errors");

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(SERVER_ERROR).send({
        message: "Внутренняя ошибка сервера",
        stack: err.stack,
      });
    });
};

const createCards = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
          stack: err.stack,
        });
      } else {
        return res.status(SERVER_ERROR).send({
          message: "Внутренняя ошибка сервера",
          err: err.message,
        });
      }
    });
};

const cardDelete = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(NOT_FOUND).send({
          message: "Пользователь с указанным _id не найден",
          stack: err.stack,
        });
      } else {
        return res.status(SERVER_ERROR).send({
          message: "Внутренняя ошибка сервера",
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: "Карточка с указанным _id не найдена",
          stack: err.stack,
        });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
          stack: err.stack,
        });
      }
      return res.status(SERVER_ERROR).send({
        message: "Внутренняя ошибка сервера",
        stack: err.stack,
      });
    });
};
const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: "Карточка с указанным _id не найдена",
          stack: err.stack,
        });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
          stack: err.stack,
        });
      }
      return res.status(SERVER_ERROR).send({
        message: "Внутренняя ошибка сервера",
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  createCards,
  cardDelete,
  likeCard,
  dislikeCard,
};

const cardModel = require("../models/cards");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(SERVER_ERROR).send({
        message: "Внутренняя ошибка сервера",
      });
    });
};

const createCards = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.send(card);
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

const cardDelete = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Карточка с указанным _id не найдена",
        });
      }
      if (err.name === "CastError") {
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

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .orFail()
    .then((card) => {
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Карточка с указанным _id не найдена",
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
const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((card) => {
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Карточка с указанным _id не найдена",
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

module.exports = {
  getCards,
  createCards,
  cardDelete,
  likeCard,
  dislikeCard,
};

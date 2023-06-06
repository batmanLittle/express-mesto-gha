const cardModel = require("../models/cards");
const Forbidden = require("../utils/Forbidden");
const BadRequest = require("../utils/BadRequest");
const NotFound = require("../utils/NotFound");

const getCards = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const cardDelete = (req, res, next) => {
  cardModel
    .findById(req.params.cardId)
    .orFail()
    .then((card) => {
      cardModel
        .deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            next(new Forbidden("Невозможно удалить чужую карту"));
          } else {
            res.send({ message: "Пост удалён" });
          }
        });
    })
    .catch(() => {
      throw new NotFound("Карточка с таким id не найдена");
    })
    .catch(next);
};

const createCards = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest("Переданы некорректные данные");
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
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
        next(new NotFound("Карточка с таким id не найдена"));
      }
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
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
        next(new NotFound("Карточка с таким id не найдена"));
      }
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCards,
  cardDelete,
  likeCard,
  dislikeCard,
};

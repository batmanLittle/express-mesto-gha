const cardsModel = require("../models/cards");

const getCards = (req, res) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCards = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  cardsModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      });
    });
};

const cardDelete = (req, res) => {
  cardsModel
    .findByIdAndRemove(req.params.cardId)
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
  getCards,
  createCards,
  cardDelete,
};

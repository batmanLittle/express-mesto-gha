const router = require("express").Router();
const {
  getCards,
  createCards,
  cardDelete,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const { createCardsValid, cardIdValid } = require("../middlewares/validation");

router.get("/cards", getCards);

router.post("/cards", createCardsValid, createCards);

router.delete("/cards/:cardId", cardIdValid, cardDelete);
router.put("/cards/:cardId/likes", cardIdValid, likeCard);
router.delete("/cards/:cardId/likes", cardIdValid, dislikeCard);

module.exports = router;

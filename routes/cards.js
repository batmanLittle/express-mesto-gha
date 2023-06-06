const router = require("express").Router();
const {
  getCards,
  createCards,
  cardDelete,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const { createCardsValid } = require("../middlewares/validation");

router.get("/cards", getCards);

router.post("/cards", createCardsValid, createCards);

router.delete("/cards/:cardId", cardDelete);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;

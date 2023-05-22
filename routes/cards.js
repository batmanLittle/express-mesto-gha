const router = require("express").Router();
const { getCards, createCards, cardDelete } = require("../controllers/cards");

router.get("/cards", getCards);

router.post("/cards", createCards);

router.delete("/cards/:cardId", cardDelete);

module.exports = router;

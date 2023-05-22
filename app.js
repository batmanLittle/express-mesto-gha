const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "646b4a71852abc938cdacd83", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.listen(3000, () => {
  console.log("App listening on server 3000");
});

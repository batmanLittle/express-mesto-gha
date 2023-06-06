const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { NOT_FOUND } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { createUserValid, loginValid } = require("./middlewares/validation");
const { errors } = require("celebrate");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", loginValid, login);
app.post("/signup", createUserValid, createUser);
// app.use(auth);
app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: "Страница  по этому адресу не найдена" });
});

app.use(errors());

app.use((err, req, res, next) => {
  console.log(err.name);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(3000, () => {
  console.log("App listening on server 3000");
});

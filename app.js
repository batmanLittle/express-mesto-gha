const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const errorPath = require("./utils/errorPath");
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

app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use("/*", auth, errorPath);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(3000, () => {
  console.log("App listening on server 3000");
});

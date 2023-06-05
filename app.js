const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { NOT_FOUND } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: "646b4a71852abc938cdacd83", // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.post("/signin", login);
app.post("/signup", createUser);
// app.use(auth);
app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: "Страница  по этому адресу не найдена" });
});

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

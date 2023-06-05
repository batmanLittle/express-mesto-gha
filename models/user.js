const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [false, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      required: [false, 'Поле "about" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      required: [false, 'Поле "avatar" должно быть заполнено'],
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Введите URL",
      },
    },
    email: {
      type: String,
      required: [true, "Введите email"],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Введите корректный email",
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, "Введите пароль"],
      minlength: [8, "Минимальная длина пароля - 8"],
    },
  },
  { versionKey: false }
);
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);

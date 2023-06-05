const jwt = require("jsonwebtoken");
const Auth = require("../utils/ Auth");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new Auth(" Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    next(new Auth(" Необходима авторизация"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

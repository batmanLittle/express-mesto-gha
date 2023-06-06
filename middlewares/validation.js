const { celebrate, Joi } = require("celebrate");

const avatarRegExp =
  /^https?:\/\/?(www\.)?[a-zA-Z0-9\-._~:/?#\\[\]@!\\$&'()*+,;=]+(#)?$/;

const getUsersByIdValid = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const createUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(avatarRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const updateUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(avatarRegExp),
  }),
});

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const createCardsValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(avatarRegExp),
  }),
});

const cardIdValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  cardIdValid,
  updateAvatarValid,
  getUsersByIdValid,
  createUserValid,
  updateUserValid,
  loginValid,
  createCardsValid,
};

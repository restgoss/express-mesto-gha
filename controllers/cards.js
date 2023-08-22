const cardSchema = require('../models/card');
const {
  GENERAL_ERROR,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  STATUS_OK_CREATED,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => res.status(GENERAL_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(STATUS_OK_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Ошибка валидации, некорректные данные',
        });
      } else {
        res.status(GENERAL_ERROR).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: 'Не существует карточки с таким _id' });
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Не существует карточки с таким _id',
        });
      } else {
        res.status(GENERAL_ERROR).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: 'Не существует карточки с таким _id' });
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Не существует карточки с таким _id',
        });
      }
      return res.status(GENERAL_ERROR).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: 'Не существует карточки с таким _id' });
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Не существует карточки с таким _id',
        });
      }
      return res.status(GENERAL_ERROR).send({ message: err.message });
    });
};

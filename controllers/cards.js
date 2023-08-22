const cardSchema = require('../models/card')

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }))
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user._id
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Ошибка валидации, некорректные данные',
        })
      } else {
        res.status(500).send({ message: err.message })
      }
    })
}

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params
  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Не существует карточки с таким _id' })
      }
      return res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Не существует карточки с таким _id',
        })
      } else {
        res.status(500).send({ message: err.message })
      }
    })




}

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Не существует карточки с таким _id' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Не существует карточки с таким _id',
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Не существует карточки с таким _id' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Не существует карточки с таким _id',
        });
      }
      return res.status(500).send({ message: err.message });
    });
};


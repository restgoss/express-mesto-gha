const userSchema = require('../models/user');
const {
  GENERAL_ERROR,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  STATUS_OK_CREATED,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(GENERAL_ERROR).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.status(STATUS_OK_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Ошибка валидации, некорректные данные',
          });
      } else {
        res.status(GENERAL_ERROR).send({ message: err.message });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  userSchema
    .findById(userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Некорректные данные' });
      } if (err.message === 'NotFound') {
        return res.status(RESOURCE_NOT_FOUND).send({ message: 'Не существует пользователя с указанным _id' });
      }
      return res.status(GENERAL_ERROR).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Некорректные данные, не удалось обновить профиль.',
        });
      }
      return res.status(GENERAL_ERROR).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Некорректные данные, не удалось обновить профиль.',
        });
      } else {
        res.status(GENERAL_ERROR).send({ message: err.message });
      }
    });
};

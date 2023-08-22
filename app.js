const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const router = require('express').Router();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.connection.on('connected', () => console.log('Mongoose connected'));

// Middleware для обработки JSON
app.use(express.json());

// Middleware для req.user
app.use((req, res, next) => {
  req.user = {
    _id: '64e36c9140cfc2983e43bb4c'
  };
  next();
});

// Используем роутеры
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

// Применяем роутер
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

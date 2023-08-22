const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const router = require('express').Router();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.connection.on('connected', () => console.log('Mongoose connected'));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64e36c9140cfc2983e43bb4c'
  };
  next();
});

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

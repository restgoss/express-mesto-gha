const express = require('express')
const app = express()

module.exports.createCard = (req, res) => {
  console.log(req.user._id)
};


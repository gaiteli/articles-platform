const express = require('express');
const router = express.Router();
const { Channel } = require('@models');
const { success, failure } = require('@utils/responses')

router.get('/', async function(req, res, next) {
  try {
    const data = await Channel.findAll()
  
    success(res, 'channels acquired successfully' , data)
  } catch(error) {
    failure(res, error)
  }
});

module.exports = router
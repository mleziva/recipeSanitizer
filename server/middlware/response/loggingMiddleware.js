const express = require('express');
const logger = require('../../logging/logger');


const router = express.Router();

// a middleware function with no mount path. This code is executed for every request to the router
router.use('/recipe', (req, res, next) => {
  const time = Date.now() - req.start;
  logger.info({
    message: 'response',
    responseSuccess: true,
    elapsedTime: time,
    correlationId: req.correlationId,
  });
  next();
});

module.exports = router;

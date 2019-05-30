const express = require('express');
const uuidv1 = require('uuid/v1');
const logger = require('../../logging/logger');

const router = express.Router();

router.use('/recipe', (req, _res, next) => {
  const reqIp = req.connection.remoteAddress || req.headers['x-forwaded-for'];
  req.correlationId = uuidv1();
  req.start = Date.now();
  logger.info({
    message: `request from ${reqIp} for ${req.url}`,
    requestUrl: req.url,
    requestorIp: reqIp,
    correlationId: req.correlationId,
  });
  next();
});

module.exports = router;

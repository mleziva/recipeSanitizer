const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./server/recipeRoutes');
const loggingReqMiddleware = require('./server/middlware/request/loggingMiddleware');
const loggingResMiddleware = require('./server/middlware/response/loggingMiddleware');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use('/api', loggingReqMiddleware);
app.use('/api', apiRoutes);
app.use('/api', loggingResMiddleware);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json('error');
// });

module.exports = app;

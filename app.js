var createError = require('http-errors'); // 에러처리
var express = require('express'); // 익스프레스
var path = require('path'); // 서버 절대경로 찾아주는 것
var cookieParser = require('cookie-parser'); // 쿠키파싱해주는거
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 뷰 템플릿 폴더경로 셋팅
app.set('view engine', 'pug'); // 퍼그셋팅

app.use(logger('dev'));
app.use(express.json()); // 바디파서 : POST 데이터로 오는 파라미터 처리
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

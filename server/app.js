var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const db = require('./app/models');

const Role = db.role;
const User = db.user;
const Topic = db.topic;

const { ROLES, TOPICS } = db;
async function initial() {
  // user roles initialize ...
  const countRole = await Role.count();
  if (countRole === 0)
  ROLES.forEach((role) => {
    Role.create({
      name: role
    });
  });
  
  const countUser = await Role.count();
  if (countRole === 0)
  // admin setting
  User.create({
    firstname: 'Zakwan',
    lastname: 'Jaroucheh',
    email: 'admin@researchary.com',
    roleId: 1,
    password: bcrypt.hashSync('root', 8),
    unHashedPassword: 'root',
    status: 'active'
  });
  
  var path = require.main.path+'/public/uploads';
  fs.existsSync(path) || fs.mkdirSync(path)
}
db.sequelize.sync().then(() => {
  initial();
});
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('public', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  
});
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config');
const { user } = require('../models');
const fs = require('fs');

// const { sequelize } = db;

const User = db.user;

const { ROLES } = db;

const JWT_SECRET = config.secret;
const JWT_EXPIRES_IN = 86400;

const MEMBER = 3;
exports.signup = (req, res) => {
  // Save User to Database
  const role = MEMBER;
  
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    roleId: role,
  })
    .then((userData) => {

      var path = require.main.path+'/public/uploads/user'+userData.id;
      fs.existsSync(path) || fs.mkdirSync(path)

      const accessToken = jwt.sign({ userId: userData.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });
      
      //User.update({ photoURL: `/static/mock-images/avatars/avatar_${userData.id%10}.png` }, { where: { id: userData.id } });

      const user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        //photoURL: `/static/mock-images/avatars/avatar_${userData.id%10}.png`,
        roleId: userData.roleId,
        phone: userData.phone,
        
      };

      res.status(200).send({ accessToken, user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  // Save User to Database
  const role = MEMBER;
  
  User.findOne({
    where:{id:req.body.id}
  })
    .then((userData) => {

      // var path = require.main.path+'/public/uploads/user'+userData.id;
      // fs.existsSync(path) || fs.mkdirSync(path)

      const accessToken = jwt.sign({ userId: userData.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });
      
      //User.update({ photoURL: `/static/mock-images/avatars/avatar_${userData.id%10}.png` }, { where: { id: userData.id } });

      const user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        photoURL: userData.photoURL,
        roleId: userData.roleId,
        phone: userData.phone,
        role: ROLES[userData.roleId-1],
        status: userData.status
      };

      res.status(200).send({ accessToken, user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then((userData) => {
      if (!userData) {
        return res.status(400).send({ message: 'auth/user-not-found' });
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, userData.password);

      if (!passwordIsValid) {
        return res.status(400).send({
          accessToken: null,
          message: 'auth/wrong-password'
        });
      }

      const token = jwt.sign({ userId: userData.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN // 24 hours 86400
      });

      const user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        photoURL: userData.photoURL,
        roleId: userData.roleId,
        phone: userData.phone,
        status: userData.status,
      };

      const accessToken = token;
      res.status(200).send({ accessToken, user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

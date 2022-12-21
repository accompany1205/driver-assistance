/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
//const { hashSync } = require('bcryptjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const formidable = require('formidable');

const config = require('../config/auth.config');

const JWT_SECRET = config.secret;

const db = require('../models');

const Op = db.Sequelize.Op;

const { getPagination } = require('./queryAssist');

const { getPagingData } = require('./queryAssist');
var fs = require('fs');
const { removeDirectory } = require('./utils/fsUtils');

const User = db.user;
const { ROLES } = db;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/static/uploads');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage }).single('file');

exports.getUserList = async (req, res) => {
  const { status, orderBy, filterString, page } = req.body;
  

  const { limit, offset } = getPagination(page.page, page.rows);

  var condition = status != 'all' ? { status: status } : null;
  const count = await User.count({
    where: {
      [Op.and]: [
        condition,
        {
          [Op.or]: [
            { firstname: { [Op.like]: `%${filterString}%` } },
            { lastname: { [Op.like]: `%${filterString}%` } }
          ]
        }
      ]
    }
  });
  User.findAndCountAll({
    limit: limit,
    offset: offset,
    order: [req.body.orderBy.split('|')],
    where: {
      [Op.and]: [
        condition,
        {
          [Op.or]: [
            { firstname: { [Op.like]: `%${filterString}%` } },
            { lastname: { [Op.like]: `%${filterString}%` } }
          ]
        }
      ]
    }
  }).then((datas) => {
    const { rows } = getPagingData(datas, page.page, limit);
    const users = [];
    rows.map((userInfo) => {
      const { id, firstname, lastname, email, photoURL, roleId, status, phone } = userInfo;
      const user = {
        id,
        firstname,
        lastname,
        email,
        photoURL: photoURL,
        status,
        phone: phone,
        roleId: roleId,
        role: ROLES[roleId - 1],
      };

      users.push(user);
    });
    
    res.status(200).send({ count: count, users: users });
  });
};

exports.updateProfile = async (req, res) => {
  
  const id = req.headers['x-id'];
  
  var path = require.main.path+'/public/uploads/user'+id+'/avatar';
  await fs.readdir(path, function(error, files){
    if(error) console.log('error occoured!')
    else files.forEach(file=> fs.unlinkSync(path+'/'+file));
  });
  await fs.existsSync(path) || fs.mkdirSync(path,{recursive:true});
  

  var form = new formidable.IncomingForm()
  
  form.on('fileBegin', function (name, file) {
    file.filepath = require.main.path+'/public/uploads/user' + id + '/avatar/'+file.originalFilename;
  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.originalFilename);
  });

  form.parse(req, function (err, fields, files) {
    var photoURL;
    if (files && files.file) {
      photoURL = '/uploads/user' + fields.id + '/avatar/' + files.file.originalFilename;
    }
    else
      photoURL = '';
    var query =
      fields.password.length > 0 ?
        {
          firstname: fields.firstname,
          lastname: fields.lastname,
          email: fields.email,
          phone: fields.phone,
          status: fields.status,
          password: bcrypt.hashSync(fields.password),
          roleId: fields.role || 2
        } :
        {
          firstname: fields.firstname,
          lastname: fields.lastname,
          email: fields.email,
          phone: fields.phone,
          status: fields.status,
          roleId: fields.role || 2
        }
    if(photoURL != '')
        query.photoURL =photoURL;
    User.update(
      {
        ...query
      },
      { where: { id: fields.id } }
    )
      .then(() => {
        User.findOne({
          where: {
            id: fields.id
          }
        }).then((userData) => {
          const user = {
            id: userData.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            email: userData.email,
            photoURL: userData.photoURL,
            status: userData.status,
            roleId: userData.roleId,
            role: ROLES[userData.roleId - 1],
            //roles: ROLES[role - 1].toUpperCase()
          };
          res.status(200).json(user)
        })
      })
      .catch((error) => {
        console.log('error', error);
      });
  })


};

exports.addUser = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then((data) => {
    if (data) res.status(200).json({ message: 'Registerd email' });
    
    User.create({
      firstname: req.body.name,
      lastname: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      roleId: Number(req.body.role),
      password: bcrypt.hashSync(req.body.password, 8),
      status: req.body.status ? 'active' : 'inActive'
    }).then((userData) => {
        
      const user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        roleId: userData.roleId,
        role: ROLES[userData.roleId - 1],
        status: userData.status,
        phone:userData.phone
      };
      res.status(200).json(user)
    }).catch((error) => {
    })
  })
}
exports.deleteUser = async (req,res)=> {
  // delete user directory in uploads folder.
  req.body.id.forEach((id)=> {
    try{
      console.log(require.main.path+'/public/uploads/user'+id);
      removeDirectory(require.main.path+'/public/uploads/user'+id)
    }catch(error){
      console.error('error');
    }
  })
  

  try{
     User.destroy({where:{id:req.body.id}})
          .then((count)=>{
            console.log("delete row numbers", count);
            res.status(200).send([]);
          });
    
  }catch(error){
    
    res.status(500);
  }
}

exports.uploadAvatar = async(req, res) => {
  const id = req.headers['x-id'];
  
  const fileName = req.headers['x-file'];
  
  var path = require.main.path+'/public/uploads/user'+id+'/avatar';

  await fs.readdir(path, function(error, files){
    if(error) console.log('error occoured!')
    else files.forEach(file=> fs.unlinkSync(path+'/'+file));
  });
  await fs.existsSync(path) || fs.mkdirSync(path,{recursive:true});
  
  var form = new formidable.IncomingForm()

  form.parse(req);
  
  form.on('fileBegin', function (name, file) {
    file.filepath = require.main.path+'/public/uploads/user' + id + '/avatar/' + file.originalFilename;
    
    
  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.originalFilename);
  });
  

  form.parse(req, function (err, fields, files) {

    var photoURL;
    if (files && files.file) {
      photoURL = '/uploads/user' + id + '/avatar/' + files.file.originalFilename;
    }
    else
      photoURL = null;
    
    User.update(
      {
        photoURL: photoURL
      },
      { where: { id: id } }
    )
      .then(() => {
        res.status(200).json({id,photoURL})
      })
      .catch((error) => {
        console.log('error', error);
      });
  })
};

exports.getProfile = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send([]);
  }

  const accessToken = authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, JWT_SECRET);

  User.findOne({
    where: {
      id: userId
    }
  }).then((userData) => {
    const user = {
      id: userData.id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      photoURL: userData.photoURL,
      role: ROLES[userData.roleId - 1],
      roleId:userData.roleId,
      phone: userData.phone,
      status: userData.status
    };

    res.status(200).send({ user });
  });
};




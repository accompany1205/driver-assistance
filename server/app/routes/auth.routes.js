const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.get('/', (req, res) => {
    res.json("connected!");
  })

  app.post('/api/auth/register', [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], controller.signup);

  app.post('/api/auth/login', controller.signin);
  app.post('/api/auth/updateUser', controller.update);
};

whre is doc?
for rxdb?
resourceLimitsdownload

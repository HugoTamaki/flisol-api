var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(expressJWT({secret: 'mysecrethere'}).unless({ path: ['/api/login', '/api/dogs'] }))

var port = process.env.PORT || 8080;

var router = express.Router();

var Dog     = require('./models/dog');
var User   = require('./models/user');

router.get('/', function(req, res) {
  res.json({message: 'hooray! wellcome to our api!'});
});

router.route('/dogs')
  .get(function(req, res) {
    // var token = req.get('Authorization').split(' ')[1];
    // var decoded = jwt.verify(token, 'mysecrethere');
    // console.log('TOKEN: ', token);
    // console.log('NAME: ', decoded['_doc'].email);
    // console.log('PASSWORD: ', decoded['_doc'].password);

    Dog.find(function(err, dogs) {
      if (err)
        res.send(err);

      res.json(dogs);
    })
  })

router.route('/login')
  .post(function(req, res) {
    User.where('email', req.body.user.email).findOne(function(err, user) {
      User.validPassword(req.body.user.password, user)
        .then(function(valid) {
          var token = jwt.sign(user, 'mysecrethere')
          res.setHeader('Token', token)
          res.json('valid user')
        })
        .catch(function() {
          res.json('invalid email or password')
        })
    });

  })

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/flisol-dogs');
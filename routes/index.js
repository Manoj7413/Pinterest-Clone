var express = require('express');
var router = express.Router();
const usermodel = require('./users');
const postmodel = require('./posts');
const passport = require('passport');
const upload = require('./multer');

const localstrategy = require('passport-local').Strategy;
passport.use(new localstrategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login', {error : req.flash('error')});
});

router.get('/feed',isLoggedIn, async function(req, res) {
  const myuser = await usermodel.findOne({username: req.session.passport.user}).populate('posts');
  res.render('feed', {myuser});
});

router.get('/upload_here',isLoggedIn, function(req, res) {
  res.render('uploads');
});

// for profile image uploading
router.post('/fileupload', isLoggedIn, upload.single('image'), async (req, res) => {
  const user = await usermodel.findOne({username: req.session.passport.user});
  user.profilePicture = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

// for post image uploading
router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded');
  }
  const userr = await usermodel.findOne({username: req.session.passport.user});
  const post = await postmodel.create({
    imagetext: req.body.imagecaption,
    image: req.file.filename,
    user: userr._id
  });

  userr.posts.push(post._id);
  await userr.save();
  res.redirect('/profile');
});

router.get('/profile', isLoggedIn, async function(req, res) {
  const newuser = await usermodel.findOne({
    username: req.session.passport.user
  }).populate('posts')
  res.render('profile', {newuser});
});

router.post('/register', function(req, res) {
  var userdata = new usermodel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    ProfileImage: req.file.filename,
  });

  usermodel.register(userdata, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect('/');
      });
    })
    .catch(function(err) {
      res.status(500).send(err.message);
    });
});

router.post('/login', passport.authenticate("local", {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
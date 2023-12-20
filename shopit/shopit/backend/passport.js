const User = require('./models/user');
// const keys = require('./config/config');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID ="ATx4GXOsheEiFNFbSKHsU09dRol7LaBDv1erhn1QWC8JWOmwvwBO7xERXvgRzH8o0fqUjYG13nN5q0bY";
const GOOGLE_CLIENT_SECRET = "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";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
      done(err, user._id);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
     function (accessToken, refreshToken, profile, cb) {
      User.findOne({userId:profile.id})
      .then((existingUser)=>{ 
        if(existingUser){
          done(null,existingUser)
        }else{
new User.findOrCreate({
      userName:profile.userName,
      email:profile.email,
      password:profile.password,
      filename:profile.filename
    }).save().then((user)=>{
      cb(null,user);
    })
        }
      })
    
  })

);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );


const express = require('express');

const mongoose = require('./db');

const User = require('./models/User');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/song');

const app  = express();
app.use(express.json());
const port = 4000;

//setup passport jwt


let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'ThisKeyWillBeSecret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));


app.get('/',(req,res)=>{
    res.send("Hello World");
});  

app.use('/auth',authRoutes);
app.use('/song',songRoutes);

app.listen(port,()=>{
    console.log(`App is running on port :${port}`);
})
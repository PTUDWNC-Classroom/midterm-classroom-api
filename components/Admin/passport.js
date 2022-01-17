const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload)
    return done(null, { _id: jwt_payload._id, username: jwt_payload.username });
  })
);

module.exports = passport;

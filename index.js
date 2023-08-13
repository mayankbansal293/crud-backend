const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const jwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const bcrypt = require("bcrypt")

const app = express()
var cors = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  res.header(
    "Access-Control-Allow-Headers",
    "accept, content-type, x-access-token, x-requested-with"
  )
  next()
}

app.use(cors)
app.use(bodyParser.json())

mongoose.connect(
  "mongodb+srv://mayankbansal293:mayank%4022@cluster0.93ccvk3.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
const User = require("./models/User")
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "your_secret_key",
}
passport.use(
  new jwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub)
      .then((user) => {
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
      .catch((error) => done(error, false))
  })
)

app.use("/auth", require("./routes/auth"))
app.use("/user", require("./routes/user"))

app.listen(3001, () => {
  console.log("Server is running on port 3001")
})

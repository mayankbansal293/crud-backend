const express = require("express")
const passport = require("passport")

const router = express.Router()

// Protected route
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "This is a protected route", user: req.user })
  }
)

module.exports = router

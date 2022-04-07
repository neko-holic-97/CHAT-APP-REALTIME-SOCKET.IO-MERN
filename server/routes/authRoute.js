const router = require("express").Router();
const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controller/authController");
// const authMidleware = require("../middleware/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);

module.exports = router;

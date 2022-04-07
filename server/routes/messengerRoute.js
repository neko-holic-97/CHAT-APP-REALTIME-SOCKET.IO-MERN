const router = require("express").Router();

const {
  getFriends,
  messageSaved,
  messageGet,
  imageSend,
  seenMessage,
  deliveredMessage,
} = require("../controller/messengerController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/friends", authMiddleware, getFriends);
router.post("/send", authMiddleware, messageSaved);
router.get("/get-mess/:id", authMiddleware, messageGet);
router.post("/image-send", authMiddleware, imageSend);
router.post("/seen-message", authMiddleware, seenMessage);
router.post("/delivered-message", authMiddleware, deliveredMessage);
module.exports = router;

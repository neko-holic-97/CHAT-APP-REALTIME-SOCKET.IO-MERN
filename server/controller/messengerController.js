const Messenger = require("../models/Messenger");
const User = require("../models/User");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

const getLastMess = async (myId, friendId) => {
  const msg = await Messenger.findOne({
    $or: [
      {
        $and: [{ senderId: { $eq: myId } }, { reseverId: { $eq: friendId } }],
      },
      {
        $and: [{ senderId: { $eq: friendId } }, { reseverId: { $eq: myId } }],
      },
    ],
  }).sort({ updateAt: -1 });

  return msg;
};

module.exports.getFriends = async (req, res) => {
  const myId = req.myId;
  let fnd_msg = [];

  try {
    const friendGet = await User.find({
      _id: { $ne: myId },
    });

    for (let i = 0; i < friendGet.length; i++) {
      let lastmess = await getLastMess(myId, friendGet[i].id);
      fnd_msg = [...fnd_msg, { fndInfo: friendGet[i], msgInfo: lastmess }];
    }

    res.status(200).json({ success: true, friends: fnd_msg });
  } catch (error) {
    res
      .status(500)
      .json({ error: { errorMessenger: "Internal server error." } });
  }
};

module.exports.messageGet = async (req, res) => {
  const myId = req.myId;
  const friendId = req.params.id;

  try {
    let getAllMess = await Messenger.find({
      $or: [
        {
          $and: [{ senderId: { $eq: myId } }, { reseverId: { $eq: friendId } }],
        },
        {
          $and: [{ senderId: { $eq: friendId } }, { reseverId: { $eq: myId } }],
        },
      ],
    });

    res.status(200).json({ success: true, message: getAllMess });
  } catch (error) {
    res
      .status(500)
      .json({ error: { errorMessenger: "Internal server error." } });
  }
};

module.exports.messageSaved = async (req, res) => {
  const { senderName, reseverId, message } = req.body;
  const senderId = req.myId;

  try {
    const messSaved = await Messenger.create({
      senderId: senderId,
      senderName: senderName,
      reseverId: reseverId,
      message: {
        text: message,
        image: "",
      },
    });
    res.status(201).json({
      success: true,
      message: messSaved,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: { errorMessenger: "Internal server error." } });
  }
};

module.exports.imageSend = (req, res) => {
  const senderId = req.myId;
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    const { senderName, reseverId } = fields;

    if (Object.keys(files).length === 0) {
      res
        .status(400)
        .json({ error: { errorMessenger: "Please provide image." } });
    }
    if (Object.keys(files).length === 0) {
      const { size, type } = files.image;
      const imageSize = size / 1000 / 1000;
      const typeImg = type.split("/")[1];
      if (typeImg !== "png" && typeImg !== "jpg" && typeImg !== "jpeg") {
        res
          .status(500)
          .json({ error: { errorMessenger: "Please provide user image." } });
      }
      if (imageSize > 8) {
        res.status(500).json({
          error: {
            errorMessenger: "Please provide your image less than 8 MB.",
          },
        });
      }
    } else {
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
      try {
        const result = await cloudinary.uploader.upload(files.image.filepath);

        const messSaved = await Messenger.create({
          senderId: senderId,
          senderName: senderName,
          reseverId: reseverId,
          message: {
            text: "",
            image: result.url,
          },
        });
        res.status(201).json({
          success: true,
          message: messSaved,
        });
      } catch (error) {
        res
          .status(500)
          .json({ error: { errorMessage: ["Image upload failed."] } });
      }
    }
  });
};

module.exports.seenMessage = async (req, res) => {
  const messageID = req.body._id;

  await Messenger.findByIdAndUpdate(messageID, { status: "seen" })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: { errorMessenger: "Internal server error." } });
    });
};

module.exports.deliveredMessage = async (req, res) => {
  const messageID = req.body._id;

  await Messenger.findByIdAndUpdate(messageID, { status: "delivered" })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: { errorMessenger: "Internal server error." } });
    });
};

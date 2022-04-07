const formidable = require("formidable");
const validator = require("validator");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

module.exports.userRegister = (req, res) => {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    const { userName, email, password, confirmPassword } = fields;
    const { image } = files;
    const error = [];

    if (!userName) {
      error.push("Please enter your username.");
    }
    if (!email) {
      error.push("Please enter your email.");
    }
    if (email && !validator.isEmail(email)) {
      error.push("Please enter your valid email.");
    }
    if (!password) {
      error.push("Please enter your password.");
    }
    if (!confirmPassword) {
      error.push("Please enter your confirm password.");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push("Password must be same.");
    }
    if (password && password.length < 6) {
      error.push("Please enter password must be 6 character");
    }

    if (Object.keys(files).length === 0) {
      error.push("Please up load your image.");
    }
    if (Object.keys(files).length === 0) {
      const { name, size, type } = files.image;
      const imageSize = size / 1000 / 1000;
      const typeImg = type.split("/")[1];

      if (typeImg !== "png" && typeImg !== "jpg" && typeImg !== "jpeg") {
        error.push("Please provide user image");
      }
      if (imageSize > 8) {
        error.push("Please provide your image less than 8 MB");
      }
    }
    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        const checkUser = await userModel.findOne({ email: email });
        if (checkUser) {
          res
            .status(404)
            .json({ error: { errorMessage: ["Your email allready exit."] } });
        } else {
          try {
            const result = await cloudinary.uploader.upload(
              files.image.filepath
            );

            const userCreate = await userModel.create({
              userName,
              email,
              password: await bcrypt.hash(password, 10),
              image: result.url,
            });

            const token = jwt.sign(
              {
                id: userCreate._id,
                email: userCreate.email,
                userName: userCreate.userName,
                image: userCreate.image,
                registerTime: userCreate.createAt,
              },
              process.env.JWT_SEC,
              {
                expiresIn: process.env.TOKEN_EXP,
              }
            );

            const options = {
              expires: new Date(
                Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
              ),
            };

            res.status(201).cookie("authToken", token, options).json({
              successMessage: "Your register successful.",
              token,
            });
          } catch (error) {
            res
              .status(500)
              .json({ error: { errorMessage: ["Image upload failed."] } });
          }
        }
      } catch (error) {
        res
          .status(500)
          .json({ error: { errorMessage: ["Internal Server Error."] } });
      }
    }
  });
};

module.exports.userLogin = async (req, res) => {
  const error = [];
  const { email, password } = req.body;
  if (!email) {
    error.push("Please enter your email.");
  }
  if (!password) {
    error.push("Please enter your password.");
  }
  if (email && !validator.isEmail(email)) {
    error.push("Please enter your valid email.");
  }
  if (error.length > 0) {
    res.status(400).json({ error: { errorMessage: error } });
  } else {
    try {
      const checkUser = await userModel
        .findOne({ email: email })
        .select("+password");

      if (checkUser) {
        const matchPassword = await bcrypt.compare(
          password,
          checkUser.password
        );
        if (matchPassword) {
          const token = jwt.sign(
            {
              id: checkUser._id,
              email: checkUser.email,
              userName: checkUser.userName,
              image: checkUser.image,
              registerTime: checkUser.createAt,
            },
            process.env.JWT_SEC,
            {
              expiresIn: process.env.TOKEN_EXP,
            }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
            ),
          };

          res.status(200).cookie("authToken", token, options).json({
            successMessage: "Your login successful.",
            token,
          });
        } else {
          res
            .status(400)
            .json({ error: { errorMessage: ["Your password is not found."] } });
        }
      } else {
        res
          .status(400)
          .json({ error: { errorMessage: ["Your email is not found."] } });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: { errorMessage: ["Internal server error."] } });
    }
  }
};

module.exports.userLogout = (req, res) => {
  res.status(200).cookie("authToken", "").json({
    success: true,
  });
};

const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).send(`Hola user ${req.userId}`);
});

module.exports = router;

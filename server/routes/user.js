const express = require("express");
const { validate } = require("../middlewares/validateMiddleware");
const { signup, login } = require("../controllers/authController");
const { registerValidation } = require("../utlis/validators");

const router = express.Router();
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Indu
 *               email:
 *                 type: string
 *                 format: email
 *                 example: indu@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Indu@1234
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Email already exists
 */
router.post("/signup", registerValidation, validate, signup);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: indu@example.com
 *               password:
 *                 type: string
 *                 example: Indu@1234
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 */


router.post("/login", login);

module.exports = router;

const express = require("express");
const { validate } = require("../middlewares/validateMiddleware");
const {
  createTodo,
  getTodos,
  updateTodoStatus,
  deleteTodoItem,
  queryItem,
} = require("../controllers/todoController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { todoValidation } = require("../utlis/validators");

const router = express.Router();

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the authenticated user
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   toDoList:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         done:
 *                           type: boolean
 */
router.get("/todo", requireAuth, getTodos);

/**
 * @swagger
 * /todo:
 *   post:
 *     summary: Create todos for the authenticated user
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toDoList
 *             properties:
 *               toDoList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Finish React task
 *                     done:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Todo created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 todo:
 *                   type: object
 */
router.post("/todo", requireAuth, todoValidation, validate, createTodo);

/**
 * @swagger
 * /todo:
 *   put:
 *     summary: Update the status of a specific todo item
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - done
 *             properties:
 *               id:
 *                 type: string
 *                 description: Todo item's `_id`
 *                 example: 64d8fa2bfaa6eaa4c16df997
 *               done:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo updated
 *       400:
 *         description: Invalid payload
 *       404:
 *         description: Todo not found
 */
router.put("/todo", requireAuth, updateTodoStatus);

/**
 * @swagger
 * /todo:
 *   delete:
 *     summary: Delete a todo item by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Todo item's `_id`
 *                 example: 64d8fa2bfaa6eaa4c16df997
 *     responses:
 *       200:
 *         description: Todo deleted
 *       400:
 *         description: Invalid payload
 *       404:
 *         description: Todo not found
 */
router.delete("/todo", requireAuth, deleteTodoItem);

router.post("/query-task", requireAuth, queryItem);

module.exports = router;

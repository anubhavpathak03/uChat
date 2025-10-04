import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { getUsersForSideBar, getMessages, sendMessages } from "../controllers/message.controller.js";
const router = express.Router();
 
router.get('/users', ensureAuthenticated, getUsersForSideBar);
router.get('/:id', ensureAuthenticated, getMessages);
router.post('/send/:id', ensureAuthenticated, sendMessages);

export default router;
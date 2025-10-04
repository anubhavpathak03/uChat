import express from "express";
import { login, logout, signup, updateProfile, checkAuth} from "../controllers/user.contoller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

// updating profile pic 
router.put("/updateprofile", ensureAuthenticated, updateProfile);


router.get('/check', ensureAuthenticated, checkAuth);

export default router;
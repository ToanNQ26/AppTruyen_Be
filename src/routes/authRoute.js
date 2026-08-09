import express from 'express';
import { login, refeshverify, logout,googleLogin } from '../controller/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refeshverify);
router.post("/logout", logout);
router.post("/google", googleLogin);

export default router;

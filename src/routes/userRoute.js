import express from 'express';
import {getAllUsers,createUser, getUserById, deleteUserById, updateUser, updatePassword, updateRole} from '../controller/userController.js';
import { verifyToken, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();



router.post('/', createUser);
router.use(verifyToken);
router.get('/', authorize('admin'), getAllUsers);
router.get('/me', getUserById);
router.delete('/:id',authorize('admin'), deleteUserById);
router.put('/me', updateUser);
router.put('/password', updatePassword);
router.patch('/role',authorize('admin'), updateRole);

export default router; 
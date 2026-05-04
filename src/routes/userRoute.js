import express from 'express';
import {getAllUsers,createUser, getUserById, deleteUserById, updateUser, updatePassword} from '../controller/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.put('/', updateUser);
router.put('/password', updatePassword);

export default router; 
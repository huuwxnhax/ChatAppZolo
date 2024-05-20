import express from 'express'
import { changePassword, deleteUser, followUser, getAllUsers, getListFriends, getUser, unfollowUser, updateUser } from '../controllers/UserController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/',getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)
router.put('/:id/unfollow',authMiddleWare, unfollowUser)
router.get('/:id/friends',authMiddleWare, getListFriends)
router.post('/change-password',authMiddleWare, changePassword)

export default router
const router = require('express').Router();
//user routes: Get all users, get single user by its ID and populate thought and friend data, post new user, delete associations if user is deleted
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
   deleteUser
} = require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    // .put(updateUser)
    .delete(deleteUser)

router.route('/:userId/friends/:friendId')
    // .post(addFriend) BONUS
    // .delete(deleteFriend) BONUS

module.exports = router;
const { User, Thought } = require('../models');

const userController = {
    // /api/users route

    // get all users
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.json(err);
        })
    },
    // get single user by id
    getUserById({ params}, res ) {
        User.findOne({_id: params.id })
        .populate([
            {path: 'thoughts', select: '-__v'},
            {path: 'friends', select: '-__v'}
        ])
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(400).json({message: "This user & id does not exist"})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.json(err);
        })
    },
    // create a new user
    createUser({ body }, res ){
        User.create(body)
        .then(dbUserData => {
            res.json(dbUserData)
        })
        .catch(err => {
            res.json(err)
        })
    },
    //update user by id
    UpdateUser({ params, body}, res ){
        User.findOneAndUpdate({_id: params.id}, body, { new: true, })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({message: 'User with this ID does not exist'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.json(err)
        })
    },
    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({_id: params.id })
        .then(dbUserData => {
            if  (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            //remove from friends list
            User.updateMnay({ _id:{$in: dbUserData.friends }}, {$pull: {friends: params.id } }
            )
            .then(() => {
                // remove any comments associated to user
                Thought.deleteMany({ username : dbUserData.username })
                .then(() => {
                    res.json({message: 'User has been deleted'});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));   
    }

    // Bonus: add a new friend to a users friends list

     // Bonus: delete a new friend to a users friends list

}

module.exports = userController;
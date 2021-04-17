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
    }
    //delete user

  
}
const {
    listAllUsers,
    createNewUser,
    showUser,
    updateUser,
    deleteUser,
} = require('../models/user');

exports.index = async (req, res) => {
    const users = await listAllUsers();

    return res.status(200).json(users);
};

exports.create = async (req, res) => {
    const {body} = req; //on destructure req pour récuperer le body

    const user = await createNewUser(body);

    try{
        if(! user) {
            return res.status(400).json({
                name: 'Name is required.'
            });
        }   
        return res.status(201).json(user); 
    }
    catch(err){
        return res.status(400).json(err); 
    }
};

exports.show = async (req, res) => {
    const userId = req.params.userId;

    try{
        const user = await showUser(userId);

        return res.status(200).json(user);
    }
    catch(err){
        return res.status(404).json({id:"L'ID n'existe pas"});
    } 
};

exports.update = async (req, res) => {
    const userId = req.params.userId;
    const {body} = req;

    try{
        const user = await updateUser(userId, body);

        return res.status(201).json(user);
    }
    catch(err){
        return res.status(400).json(err);
    } 
};

exports.delete = async (req, res) => {
    const userId = req.params.userId; 

    try{
        const user = await deleteUser(userId);

        return res.status(204).json(user);
    }
    catch(err){
        return res.status(400).json({id:"L'ID n'existe pas"});
    }
};

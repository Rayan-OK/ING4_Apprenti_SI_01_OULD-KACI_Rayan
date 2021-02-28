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

    if(! user) {
        return res.status(400).json({
            name: 'Name is required.',
            email: 'Email is required.',
            password: 'Password is required.'
        });
    }

    return res.status(201).json(user); //Code 201 pour une création : https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
};

exports.show = async (req, res) => {
    const userId = req.params.userId;

    const user = await showUser(userId);
    if(!user) {
		return res.status(404).json({message: 'users not found'});
	}

    return res.status(200).json(user); //je n'ai pas blindé volontairement user, à vous de le faire ;)
};

exports.update = async (req, res) => {
    const userId = req.params.userId;
    const {body} = req;
    
        
	//On cherche un utilisateur qui a cet id dans notre tableau
	const user = updateUser(userId);
    //Si l'utilisateur n'a pas été trouvé
	if(!user) {
		return res.status(404).json({message: 'users not found'});
	}
    //blindage pour vérifier que le nom est correctement donné
	user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    return res.status(200).json(user);
};

exports.delete = async (req, res) => {
    //TODO delete user
    const userId = req.params.userId;	
    const user = deleteUser(userId)
    if(!user){
		return res.status(404).json({message: 'users not found'});
	}	
    return res.status(200).json(user);
    
};

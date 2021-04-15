const {
    listAllMessages,
    createNewMessage,
    updateMessage,
    deleteMessage,
} = require('../models/message');

exports.index = async (req, res) => {
    const messages = await listAllMessages(req.params.id);
    return res.status(200).json(messages);
};

exports.create = async (req, res) => {    
    const message = await createNewMessage(req.params.id, req.body);

    return res.status(200).json(message); //Code 201 pour une création : https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP

};
exports.update = async (req, res) => {
  
	//On cherche le message qui a cet id dans notre tableau
	const message = updateMessage(req.params.id, req.body, req.params.creation);

	//Si le message n'a pas été trouvé
	if(!message) {
		return res.status(404).json({message: 'Message not found'});
	}

	//vu que ce n'est pas immutable, on peut le modifier directement...
	message.content = content;
	message.author = author;

	return res.status(200).json(message);
};

exports.delete = async (req, res) => {
     //On cherche le message qui a cet id dans notre tableau
	const message = deleteMessage(req.params.id, req.params.creation, req.body);

	//Si le message n'a pas été trouvé
	if(!message) {
		return res.status(404).json({message: 'Message not found'});
	}
	
	return res.status(200).json(message);
};

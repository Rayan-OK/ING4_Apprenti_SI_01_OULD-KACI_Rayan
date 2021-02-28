const {
    listAllMessages,
    createNewMessage,
    showMessage,
    updateMessage,
    deleteMessage,
} = require('../models/message');

exports.index = async (req, res) => {
    const messages = await listAllMessages();

    return res.status(200).json(messages);
};

exports.create = async (req, res) => {
    const {body} = req; //on destructure req pour récuperer le body

    const message = await createNewMessage(body);

    try{
        if(!message.content === "") {
            return res.status(400).json({
                content: 'Content is required.'
            });
        }
        return res.status(201).json(message); 
    }
    catch(err){
        return res.status(400).json(err); 
    }
};

exports.show = async (req, res) => {
    const messageId = req.params.messageId;

    try{
        const message = await showMessage(messageId);

        return res.status(200).json(message); 
    }
    catch(err){
        return res.status(404).json({id:"L'ID n'existe pas"});
    }
};

exports.update = async (req, res) => {
    const messageId = req.params.messageId;
    const {body} = req;

    try{
        const message = await updateMessage(messageId, body);
    
        return res.status(201).json(message); 
    }
    catch(err){
        return res.status(400).json(err);
    }
};

exports.delete = async (req, res) => {
    const messageId = req.params.messageId;

    try{
        const message = await deleteMessage(messageId);

        return res.status(204).json(message); 
    }
    catch(err){
        return res.status(400).json({id:"L'ID n'existe pas"});
    }
};
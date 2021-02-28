const {
    listAllChannels,
    createNewChannel,
    showChannel,
    updateChannel,
    deleteChannel,
} = require('../models/channel');
const { listAllMessages } = require('../models/message');

exports.index = async (req, res) => {
    const channels = await listAllChannels();

    return res.status(200).json(channels);
};

exports.create = async (req, res) => {
    const {body} = req; 
    const channel = await createNewChannel(body);

    try{
        if(! channel) {
            return res.status(400).json({
                name: 'Name is required.'
            });
        }
        return res.status(201).json(channel); 
    }
    catch(err){
        return res.status(400).json(err); 
    }
};

exports.show = async (req, res) => {
    const channelId = req.params.channelId;

    try{
        const channel = await showChannel(channelId);

        return res.status(200).json(channel); 
    }
    catch(err){
        return res.status(404).json({id:"L'ID n'existe pas"});
    }
};

exports.showMessages = async (req, res) => {
    const channelId = req.params.channelId;

    try{
        const messages = await listAllMessages();
        messages = messages.filter(mess => mess.channelId === channelId);
        return res.status(200).json(messages); 
    }
    catch(err){
        return res.status(400).json({id:"L'ID n'existe pas"});
    }
};

exports.update = async (req, res) => {
    const channelId = req.params.channelId;
    const {body} = req;

    try{
        const channel = await updateChannel(channelId, body);
    
        return res.status(201).json(channel);
    }
    catch(err){
        return res.status(400).json(err);
    }
};

exports.delete = async (req, res) => {
    const channelId = req.params.channelId;

    try{
        const channel = await deleteChannel(channelId);

        return res.status(204).json(channel); 
    }
    catch(err){
        return res.status(400).json({id:"L'ID n'existe pas"});
    }
};

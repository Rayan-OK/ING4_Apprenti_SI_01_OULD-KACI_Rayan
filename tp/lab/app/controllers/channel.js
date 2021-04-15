const {
    listAllChannels,
    createNewChannel,
    showChannel,
    updateChannel,
    deleteChannel,
} = require('../models/channel');

exports.index = async (req, res) => {
    const channels = await listAllChannels();

    return res.status(200).json(channels);
};

exports.create = async (req, res) => {
    const {body} = req; //on destructure req pour récuperer le body

    const channel = await createNewChannel(body);

    if(! channel) {
        return res.status(400).json({
            name: 'Name is required.'
        });
    }

    return res.status(201).json(channel); //Code 201 pour une création : https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
};

exports.show = async (req, res) => {
    const channelId = req.params.channelId;

    const channel = await showChannel(channelId);
    if(!channel) {
		return res.status(404).json({message: 'Chanel not found'});
	}

    return res.status(200).json(channel); //je n'ai pas blindé volontairement channel, à vous de le faire ;)
};

exports.update = async (req, res) => {
   
    try {
        const { channelId } = req.params;
        await channel.updateChannel(channelId, req.body, { new: true }, (err, channnel) => {
            if (err) {
                res.status(500).send(err);
            }
            if (!user) {
                res.status(500).send('Channel not found!');
            }
            return res.status(200).json(channel);
        })
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

exports.delete = async (req, res) => {
    //TODO delete channel
    try {
        const channelId = req.params.channelId;	

        //On cherche un utilisateur qui a cet id dans notre tableau
        const channel = await deleteChannel(channelId);
        //Si l'utilisateur n'a pas été trouvé
        if(channel) {
            return res.status(200).send("Channel deleted");
        }
        throw new Error("Chanel not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
    
};

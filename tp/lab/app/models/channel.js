const {v4: uuid} = require('uuid');
const db = require('../../db_config');
const {clone, merge} = require('mixme')

const listAllChannels = async () => {
    return new Promise((resolve, reject) => {
        const channels = [];

        const options = {
            gt: 'channels:',
            lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        };

        //https://github.com/Level/level#createReadStream
        db.createReadStream(options)
            .on('data', ({key, value}) => {
                channels.push(JSON.parse(value));
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve(channels);
            });
    })

};

const createNewChannel = body => {
    if(!body.name) {
        return null //ne pas oublier les blindages !
    }

    //on créé un objet channel
    const channel = {
        id: uuid(),
        name: body.name,
    };

    return new Promise(((resolve, reject) => {
        //https://github.com/Level/level#put
        // on insère en base de données
        
        db.put(`channels:${channel.id}`, JSON.stringify(channel), (err) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }

            resolve(channel);//On a "jsonifié" notre channel lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        })
    }));
};

const showChannel = async (channelId) => {
    //on a un code asynchrone, on va donc utiliser les promesses pour nous simplifier la vie...
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_promesses
    
    return new Promise(((resolve, reject) => {
        db.get(`channels:${channelId}`, (err, value) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }

            resolve(JSON.parse(value));//On a "jsonifié" notre channel lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        });
    }));
};


const updateChannel = async (req, res) => {
    try {
        if (!channelId) {
            throw Error('Invalid Channel');
        }

        const data = await db.get(`channels:${channelId}`);
        const original = JSON.parse(data);
        channel = merge(original, channel);
        await db.put(`channels:${channelId}`, JSON.stringify(channel));
        return merge(channel, { id: channelId });

    } catch (e) {
        return e.message;
    }

};

const deleteChannel = async (channelId) => {
   
    try {
        const data = await db.get(`channels:${channelId}`);
        const original = JSON.parse(data);

        if (!original) {
            throw Error('Unregistered channel id');
        }

        await db.del(`channels:${channelId}`);
        return merge(original, { delete: 'OK' });

    } catch (e) {
        return e.message;
    }

};

module.exports = {
    listAllChannels,
    createNewChannel,
    showChannel,
    updateChannel,
    deleteChannel,
};

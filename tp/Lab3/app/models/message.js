const {v4: uuid} = require('uuid');
const db = require('../../db_config');

const listAllMessages = async () => {
    return new Promise((resolve, reject) => {
        const messages = [];

        const options = {
            gt: 'messages:',
            lte: "messages" + String.fromCharCode(":".charCodeAt(0) + 1),
        };

        //https://github.com/Level/level#createReadStream
        db.createReadStream(options)
            .on('data', ({key, value}) => {
                messages.push(JSON.parse(value));
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve(messages);
            });
    })

};

const createNewMessage = body => {
    if(!body.content) {
        return null //ne pas oublier les blindages !
    }

    //on créé un objet message
    const message = {
        id: uuid(),
        channelId: body.channelId,
        owner: body.userId,
        content: body.content,
        created_at: Date(),
    };

    return new Promise(((resolve, reject) => {
        //https://github.com/Level/level#put
        // on insère en base de données
        db.put(`messages:${message.id}`, JSON.stringify(message), (err) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }

            resolve(message);//On a "jsonifié" notre message lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        })
    }));
};

const showMessage = messageId => {
    //on a un code asynchrone, on va donc utiliser les promesses pour nous simplifier la vie...
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_promesses
    return new Promise(((resolve, reject) => {
        db.get(`messages:${messageId}`, (err, value) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }

            resolve(JSON.parse(value));//On a "jsonifié" notre message lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        });
    }));
};

const updateMessage = async (messageId, body) => {  
    if(!messageId || !body.name){
        return null;
    } 
    const message = {
        id: uuid(),
        channelId: body.channelId,
        owner: body.userId,
        content: body.content,
        created_at: Date(),
    };

    return new Promise(((resolve, reject) => {
        db.put(`messages:${messageId}` ,JSON.stringify(message), (err) => {
            if(err) {
                return(resolve());
            }
            resolve(message);//On a "jsonifié" notre message lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        });
    }));
};

const deleteMessage = async messageId => {
    if(!messageId){
        return null;
    }

    return new Promise(((resolve, reject) => {
        db.del(`messages:${messageId}`, (err) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }
            resolve();//On a "jsonifié" notre message lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        });
    }));
};

module.exports = {
    listAllMessages,
    createNewMessage,
    showMessage,
    updateMessage,
    deleteMessage,
};

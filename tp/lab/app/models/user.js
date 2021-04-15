const {v4: uuid} = require('uuid');
const db = require('../../db_config');

const listAllUsers = async () => {
    return new Promise((resolve, reject) => {
        const users = [];

        const options = {
            gt: 'users:',
            lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        };

        //https://github.com/Level/level#createReadStream
        db.createReadStream(options)
            .on('data', ({key, value}) => {
                users.push(JSON.parse(value));
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve(users);
            });
    })

};

const createNewUser = body => {
    if(!body.name && !body.email && !body.password) {
        return null //ne pas oublier les blindages !
    }

    //on créé un objet user
    const user = {
        id: uuid(),
        name: body.name,
        email: body.email,
        password: body.password,
    };

    return new Promise(((resolve, reject) => {
        db.put(`users:${user.id}`, JSON.stringify(user), (err) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }

            resolve(user);//On a "jsonifié" notre user lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        })
    }));
};

const showUser = async (userId) => {
    //on a un code asynchrone, on va donc utiliser les promesses pour nous simplifier la vie...
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_promesses
    
    return new Promise(((resolve, reject) => {
        db.get(`users:${userId}`, (err, value) => {
            if(err) {
                //TODO blindage erreur
                reject(err);
            }

            resolve(JSON.parse(value));//On a "jsonifié" notre user lorsque on l'a créé ligne 24. Il faut faire l'opération inverse
        });
    }));
};

const updateUser = async (userId, body) => {
    try {
        const data = await db.get(`users:${userId}`);
        const original = JSON.parse(data);
        user = merge(original, user);
        await db.put(`users:${userId}`, JSON.stringify(user));
        return merge(user, { id: userId });

    } catch (e) {
        return e.message;
    }

    
};

const deleteUser = async (userId) => {
    try {
        const data = await db.get(`users:${userId}`);
        const original = JSON.parse(data);
        await db.del(`users:${userId}`);
        return merge(original, { delete: 'OK' });

    } catch (e) {
        return e.message;
    }
    

};

module.exports = {
    listAllUsers,
    createNewUser,
    showUser,
    updateUser,
    deleteUser,
};

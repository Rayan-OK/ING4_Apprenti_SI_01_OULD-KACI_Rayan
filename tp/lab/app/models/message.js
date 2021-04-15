const {v4: uuid} = require('uuid');

const microtime = require('microtime')
const {clone, merge} = require('mixme')
const db = require('../../db_config');

const listAllMessages = async (channelId) => {
    return new Promise( (resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value)
          const [, channelId, creation] = key.split(':')
          message.channelId = channelId
          message.creation = creation
          messages.push(message)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(messages)
        })
      })

};

const createNewMessage = async (channelId)  => {
  return new Promise((resolve, reject) => {
    const messages = [];
    const option = {
        gt: `messages:${channelId}:`,
        lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
    };

    db.createReadStream(option)
        .on('data', ({ key, value }) => {
            message = JSON.parse(value);
            const [trash, channelId, creation] = key.split(':');
            message.channelId = channelId;
            message.creation = creation;
            messages.push(message);
        })
        .on('error', (err) => {
            reject(err);
        })
        .on('end', () => {
            resolve(messages);
        });
});
};


const updateMessage = async(channelId, creation, userId, message) => {
  try {
      if (!message.content) {
          throw Error('Invalid message');
      }

      const data = await db.get(`messages:${channelId}:${creation}`);
      const original = JSON.parse(data);

      if (userId !== original.author) {
          throw Error('This user isn\'t the author');
      }

      original.content = message.content;
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify(original));
      return merge(original, { id: `messages:${channelId}:${creation}` });

  } catch (e) {
      return e.message;
  }
};

const deleteMessage = async(channelId, creation, userId) => {
  try {
      const data = await db.get(`messages:${channelId}:${creation}`);
      const original = JSON.parse(data);

      if (userId !== original.author) {
          throw Error('This user isn\'t the author');
      }

      await db.del(`messages:${channelId}:${creation}`);
      return merge(original, { delete: 'OK' });

  } catch (e) {
      return e.message;
  }
};

module.exports = {
    listAllMessages,
    createNewMessage,
    updateMessage,
    deleteMessage,

};

const express = require('express');
const router = express.Router();
const bt = require('../Middleware/verifyToken');
const messageController = require('../controllers/message_controller');

router.get('/channels/:channelId/messages',bt.verifyToken, messageController.index);
router.post('/messages',bt.verifyToken, messageController.create);
router.put('/messages/:messageId',bt.verifyToken, messageController.update);
router.delete('/messages/:messageId', bt.verifyToken,messageController.delete);

//On doit respecter la convention dans la conception !
//La ressource est message.
//La particularité se trouve uniquement dans la liste (car on veut faire par rapport à un channel)

module.exports = router;
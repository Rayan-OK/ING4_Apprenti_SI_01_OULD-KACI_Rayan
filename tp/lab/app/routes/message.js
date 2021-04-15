const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message');

router.get('/:channelId/messages', messageController.index);
router.post('/:channelId/messages', messageController.create);
router.put('/:channelId/messages', messageController.update);
router.delete('/:channelId/messages', messageController.delete);

module.exports = router;

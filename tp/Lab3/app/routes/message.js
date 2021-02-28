const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message');

router.get('/', messageController.index);
router.post('/', messageController.create);
router.get('/:messageId', messageController.show);
router.put('/:messageId', messageController.update);
router.delete('/:messageId', messageController.delete);

module.exports = router;

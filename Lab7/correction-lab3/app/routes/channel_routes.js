const express = require('express');
const router = express.Router();

const channelController = require('../controllers/channel_controller');
const bt = require('../Middleware/verifyToken');
// Vérifier si le token existe
router.get('/', bt.verifyToken, channelController.index);
router.post('/',  bt.verifyToken,channelController.create);
router.get('/:channelId',bt.verifyToken, channelController.show);
router.put('/:channelId', bt.verifyToken,channelController.update);
router.delete('/:channelId', bt.verifyToken,channelController.delete);

module.exports = router;
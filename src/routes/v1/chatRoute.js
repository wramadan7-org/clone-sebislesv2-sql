const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const chatController = require('../../controllers/chatController');

router.post('/:id', auth, chatController.sendMessage);
router.get('/', auth, chatController.allMessage);
router.delete('/:id', auth, chatController.deleteMessageById);
router.get('/own', auth, chatController.listMessage);
router.get('/room/:id', auth, chatController.roomMessage);
router.delete('/room/:id', auth, chatController.deleteMessageByPartner);

module.exports = router;

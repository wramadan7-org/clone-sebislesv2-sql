const { Router } = require('express');

const router = Router();

const auth = require('../../middlewares/auth');

const deviceController = require('../../controllers/deviceController');

router.post('/', auth, deviceController.createDevice);
router.get('/', auth, deviceController.getAllDevice);
router.get('/own', auth, deviceController.getOwnDevice);
router.get('/:id', auth, deviceController.getDeviceById);
router.patch('/:id', auth, deviceController.updateDevice);
router.delete('/:id', auth, deviceController.deleteDevice);

module.exports = router;

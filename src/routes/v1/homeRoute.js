const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const { teacher } = require('../../middlewares/roleValidation');

const homeController = require('../../controllers/homeController');

router.get('/', auth, teacher, homeController.home);

module.exports = router;

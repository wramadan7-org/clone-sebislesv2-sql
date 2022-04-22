const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const wishlistValidation = require('../../validations/wishlistValidation');
const wishlistController = require('../../controllers/wishlistController');

router.post('/', auth, validate(wishlistValidation.createWishlist), wishlistController.addWishlist);
router.get('/', auth, wishlistController.getWishlist);
router.get('/:id', auth, wishlistController.getWihslistItemById);
router.delete('/', auth, wishlistController.deleteWishlistItemById);

module.exports = router;

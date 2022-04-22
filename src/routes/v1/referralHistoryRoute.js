const { Router } = require('express');
const referralHistoryController = require('../../controllers/referralHistoryController');
const auth = require('../../middlewares/auth');
const validation = require('../../middlewares/validate');
const referralHistoryValidation = require('../../validations/referralHistoryValidation');

const router = Router();

router.get('/', auth, referralHistoryController.getReferralHistories);
router.get('/:referralHistoryId', auth, validation(referralHistoryValidation.getReferralHistoryById), referralHistoryController.getReferralHistoryById);
router.patch('/:referralHistoryId', auth, validation(referralHistoryValidation.updateReferralHistory), referralHistoryController.updateReferralHistory);
router.delete('/:referralHistoryId', auth, validation(referralHistoryValidation.getReferralHistoryById), referralHistoryController.deleteReferralHistory);

module.exports = router;

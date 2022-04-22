const { Router } = require('express');
const auth = require('../../middlewares/auth');
const referenceController = require('../../controllers/referenceController');
const validate = require('../../middlewares/validate');
const referenceValidate = require('../../validations/referenceValidation');

const router = Router();

router.get('/', referenceController.getAllReference);
router.get('/own', auth, referenceController.getReferenceByUserRefer);
router.get('/:id', referenceController.getReferenceById);
router.post('/', auth, validate(referenceValidate.createReference), referenceController.createReference);
router.patch('/:id', auth, referenceController.updateReference);
router.delete('/:id', auth, referenceController.deleteReference);

module.exports = router;

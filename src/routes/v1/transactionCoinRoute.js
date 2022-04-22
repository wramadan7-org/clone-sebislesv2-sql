const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');

const transactionCoinController = require('../../controllers/transactionCoinController');

// router.post('/', transactionCoinController.transactionCoin);
router.post('/payment-notif', transactionCoinController.paymentNotif);
router.post('/action/:orderId', transactionCoinController.actionTransaction);
router.get('/history', auth, transactionCoinController.historyTransaction);
router.get('/history-detail/:id', auth, transactionCoinController.historyTransactionDetail);

module.exports = router;

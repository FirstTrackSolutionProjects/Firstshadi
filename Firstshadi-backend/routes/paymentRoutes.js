import express from 'express';
import {
  getPlans,
  createPayment,
  completePayment,
  getPaymentHistory,
  getPaymentByOrderId
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/plans', getPlans);
router.post('/', createPayment);
router.post('/complete', completePayment);
router.get('/history', getPaymentHistory);
router.get('/:orderId', getPaymentByOrderId);

export default router;
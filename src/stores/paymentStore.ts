import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface PaymentStore {
  initiatePayment: (testId: string) => Promise<{
    success: boolean;
    message: string;
    paymentId?: string;
  }>;
  verifyPayment: (paymentId: string) => Promise<boolean>;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const usePaymentStore = create<PaymentStore>(() => ({
  initiatePayment: async (testId) => {
    try {
      const { data: test } = await supabase
        .from('tests')
        .select('*, test_types(*)')
        .eq('id', testId)
        .single();

      if (!test) {
        return {
          success: false,
          message: 'Test not found'
        };
      }

      // Create a payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: test.test_types.price,
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: test.test_types.price,
        currency: 'INR',
        name: 'BrainSprint',
        description: `Payment for ${test.title}`,
        order_id: payment.id,
        handler: async (response: any) => {
          // Update payment status
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              transaction_id: response.razorpay_payment_id
            })
            .eq('id', payment.id);

          // Create purchase record
          await supabase
            .from('purchases')
            .insert({
              user_id: (await supabase.auth.getUser()).data.user?.id,
              test_id: testId,
              amount_paid: test.test_types.price,
              attempts_remaining: test.test_types.attempts_allowed,
              valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      return {
        success: true,
        message: 'Payment initiated',
        paymentId: payment.id
      };
    } catch (error) {
      console.error('Error initiating payment:', error);
      return {
        success: false,
        message: 'Error initiating payment'
      };
    }
  },

  verifyPayment: async (paymentId) => {
    try {
      const { data } = await supabase
        .from('payments')
        .select('status')
        .eq('id', paymentId)
        .single();

      return data?.status === 'completed';
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }
}));
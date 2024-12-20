import { supabase } from "@/integrations/supabase/client";

interface CreatePaymentIntentParams {
  amount: number;
  message: string;
  successUrl: string;
  cancelUrl: string;
  test?: boolean;
}

export const createPaymentIntent = async ({
  amount,
  message,
  successUrl,
  cancelUrl,
  test = false
}: CreatePaymentIntentParams) => {
  try {
    const { data: { ZIINA_API_KEY } } = await supabase
      .from('secrets')
      .select('ZIINA_API_KEY')
      .single();

    const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZIINA_API_KEY}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to fils
        currency_code: 'AED',
        message,
        success_url: successUrl,
        cancel_url: cancelUrl,
        test
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
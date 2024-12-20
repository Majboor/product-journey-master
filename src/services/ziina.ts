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
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'ZIINA_API_KEY')
      .single();

    if (secretError) throw secretError;
    if (!secretData?.value) throw new Error('Ziina API key not found');

    const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretData.value}`,
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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
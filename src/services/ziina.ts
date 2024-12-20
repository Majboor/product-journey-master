import { supabase } from "@/integrations/supabase/client";

interface CreatePaymentIntentParams {
  amount: number;  // Amount in fils
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
    // Get the API key using maybeSingle() instead of single()
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'ZIINA_API_KEY')
      .maybeSingle();

    if (secretError) {
      console.error('Error fetching Ziina API key:', secretError);
      throw new Error('Failed to retrieve Ziina API key');
    }

    if (!secretData?.value) {
      throw new Error('Ziina API key not found in secrets');
    }

    const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretData.value}`,
      },
      body: JSON.stringify({
        amount,  // Already in fils from ProductSection
        currency_code: 'AED',
        message,
        success_url: successUrl,
        cancel_url: cancelUrl,
        test
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ziina API error:', errorData);
      throw new Error(errorData.message || 'Failed to create payment intent');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
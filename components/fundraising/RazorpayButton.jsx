import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton({ amount, campaign, userEmail, userName, disabled, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load Razorpay. Please check your internet connection.');
      setLoading(false);
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      alert('Razorpay key not configured. Please add VITE_RAZORPAY_KEY_ID to your environment variables.');
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: Math.round(Number(amount) * 100), // paise
      currency: 'INR',
      name: 'FoodBridge',
      description: `Donation to: ${campaign?.title}`,
      image: 'https://media.base44.com/images/public/6a017c522945d53d0a49d427/b7df7c42b_ChatGPTImageJun4202607_14_22PM.png',
      prefill: {
        name: userName || '',
        email: userEmail || '',
      },
      notes: {
        campaign_id: campaign?.id,
        campaign_title: campaign?.title,
      },
      theme: {
        color: '#E05C2A',
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
      handler: (response) => {
        // Payment successful — response contains razorpay_payment_id
        setLoading(false);
        onSuccess(response.razorpay_payment_id);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setLoading(false);
      alert('Payment failed. Please try again.');
    });
    rzp.open();
    setLoading(false);
  };

  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
      disabled={disabled || loading}
      onClick={handlePay}
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
      ) : (
        <><CreditCard className="w-4 h-4" /> Pay ₹{amount || '0'} via Razorpay</>
      )}
    </Button>
  );
}

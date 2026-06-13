import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const PRESETS = [100, 500, 1000, 5000];

export default function DonateModal({ open, onOpenChange, campaign, userEmail, userName }) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const amt = Number(amount);
      await base44.entities.CampaignDonation.create({
        campaign_id: campaign.id,
        donor_email: userEmail,
        donor_name: anonymous ? 'Anonymous' : userName,
        amount: amt,
        message,
        anonymous,
      });
      await base44.entities.Campaign.update(campaign.id, {
        raised_amount: (campaign.raised_amount || 0) + amt,
        donor_count: (campaign.donor_count || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setDone(true);
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    setAmount('');
    setMessage('');
    setDone(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{done ? 'Thank you! 🙏' : `${t('donate')} — ${campaign?.title}`}</DialogTitle>
        </DialogHeader>
        {done ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="text-center text-muted-foreground">Your donation of <strong>₹{amount}</strong> has been recorded. You're making a real difference!</p>
            <Button onClick={handleClose} className="bg-primary hover:bg-primary/90 text-white w-full">Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Amount (₹)</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {PRESETS.map(p => (
                  <button key={p} onClick={() => setAmount(String(p))}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${amount === String(p) ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}>
                    ₹{p}
                  </button>
                ))}
              </div>
              <Input className="mt-2" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Or enter custom amount" min={1} />
            </div>
            <div>
              <Label>Message (optional)</Label>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Leave an encouraging message..." rows={2} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="rounded" />
              Donate anonymously
            </label>
            {/* UPI QR Code */}
            {amount && Number(amount) >= 1 && (
              <div className="border rounded-xl p-4 bg-muted/40 text-center space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Scan & Pay via any UPI App</p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=foodbridge@upi&pn=FoodBridge&am=${amount}&cu=INR&tn=${encodeURIComponent('Donation: ' + (campaign?.title || ''))}}`)}`}
                  alt="UPI QR Code"
                  className="mx-auto rounded-lg"
                  width={160}
                  height={160}
                />
                <div className="flex justify-center gap-3 flex-wrap pt-1">
                  {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map(app => (
                    <span key={app} className="text-xs bg-white border rounded-full px-2.5 py-1 font-medium text-foreground">{app}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">UPI ID: <span className="font-mono font-semibold text-foreground">foodbridge@upi</span></p>
              </div>
            )}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              disabled={!amount || Number(amount) < 1 || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <>Processing...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Payment Completed Successfully</>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Tap after scanning & paying via UPI to confirm your donation</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

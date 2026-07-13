import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, QrCode, Truck, CheckCircle2, Package, MessageCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useExpiryCountdown, formatCountdown } from '@/hooks/useExpiryCountdown';
import { useLanguage } from '@/lib/LanguageContext';

const STATUS_CLASSES = {
  available: 'bg-accent/10 text-accent border-accent/20',
  claimed:   'bg-blue-50 text-blue-700 border-blue-200',
  picked_up: 'bg-amber-50 text-amber-700 border-amber-200',
  delivered: 'bg-primary/10 text-primary border-primary/20',
  expired:   'bg-muted text-muted-foreground border-border',
};

const CATEGORY_KEYS = {
  cooked_meals:     'cat_cooked_meals',
  raw_ingredients:  'cat_raw_ingredients',
  packaged_food:    'cat_packaged_food',
  baked_goods:      'cat_baked_goods',
  beverages:        'cat_beverages',
  other:            'cat_other',
};

export default function DonationCard({ donation, role, userEmail, onClaim, onAcceptDelivery, onPickUp, onExpired }) {
  const { t } = useLanguage();
  const isActive = donation.status === 'available' || donation.status === 'claimed';

  const handleExpire = async () => {
    if (donation.status === 'expired') return;
    await base44.entities.Donation.update(donation.id, { status: 'expired' });
    onExpired?.();
  };

  const remaining = useExpiryCountdown(isActive ? donation : null, handleExpire);
  const countdownText = formatCountdown(remaining);
  const isUrgent = remaining !== null && remaining > 0 && remaining < 30 * 60 * 1000;

  if (donation.status === 'expired') return null;

  const statusLabelKey = {
    available: 'status_available',
    claimed:   'status_claimed',
    picked_up: 'status_picked_up',
    delivered: 'status_delivered',
    expired:   'status_expired',
  }[donation.status] || 'status_available';

  const statusCls = STATUS_CLASSES[donation.status] || STATUS_CLASSES.available;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {donation.image_url && (
        <div className="h-36 overflow-hidden">
          <img src={donation.image_url} alt={donation.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground leading-tight">{donation.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{donation.donor_name}</p>
          </div>
          <Badge variant="outline" className={`${statusCls} text-[10px] shrink-0`}>
            {t(statusLabelKey)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Package className="w-3 h-3" />{donation.quantity}</span>
          {donation.category && (
            <span>· {CATEGORY_KEYS[donation.category] ? t(CATEGORY_KEYS[donation.category]) : donation.category}</span>
          )}
        </div>

        {/* Countdown timer */}
        {countdownText && (
          <div className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 ${
            isUrgent
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {isUrgent ? <AlertTriangle className="w-3 h-3 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
            {countdownText}
          </div>
        )}

        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{donation.pickup_address}</span>
        </div>
        {donation.description && <p className="text-xs text-muted-foreground line-clamp-2">{donation.description}</p>}
        <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(donation.created_date), { addSuffix: true })}</p>

        <div className="flex gap-2 pt-1">
          <Link to={`/donation/${donation.id}`} className="flex-1">
            <Button size="sm" variant="ghost" className="w-full gap-1 text-muted-foreground hover:text-foreground border border-border">
              <MessageCircle className="w-3 h-3" /> {t('chat_details')}
            </Button>
          </Link>
          {role === 'receiver' && donation.status === 'available' && (
            <Button size="sm" onClick={onClaim} className="w-full bg-primary hover:bg-primary/90 text-white">
              {t('claim')}
            </Button>
          )}
          {role === 'volunteer' && donation.status === 'claimed' && !donation.volunteer_email && (
            <Button size="sm" onClick={onAcceptDelivery} className="w-full bg-primary hover:bg-primary/90 text-white gap-1">
              <Truck className="w-3 h-3" /> {t('accept_delivery')}
            </Button>
          )}
          {role === 'volunteer' && donation.volunteer_email === userEmail && donation.status === 'claimed' && (
            <Button size="sm" onClick={onPickUp} variant="outline" className="w-full gap-1">
              <CheckCircle2 className="w-3 h-3" /> {t('mark_picked_up')}
            </Button>
          )}
          {donation.status === 'picked_up' && donation.qr_code &&
            (donation.volunteer_email === userEmail || donation.claimed_by === userEmail) && (
            <Link to={`/delivery/${donation.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full gap-1">
                <QrCode className="w-3 h-3" /> {t('verify_delivery')}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

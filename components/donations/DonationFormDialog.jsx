import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LocationPickerMap from '@/components/map/LocationPickerMap';

const CATEGORIES = [
  { value: 'cooked_meals', labelKey: 'cat_cooked_meals' },
  { value: 'raw_ingredients', labelKey: 'cat_raw_ingredients' },
  { value: 'packaged_food', labelKey: 'cat_packaged_food' },
  { value: 'baked_goods', labelKey: 'cat_baked_goods' },
  { value: 'beverages', labelKey: 'cat_beverages' },
  { value: 'other', labelKey: 'cat_other' },
];

export default function DonationFormDialog({ open, onOpenChange, userEmail, userName }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ title: '', quantity: '', category: '', freshness_hours: '', pickup_address: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setShowMap(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          if (data.display_name) set('pickup_address', data.display_name);
        } catch {}
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location access denied. Please allow location permission in your browser settings and try again.');
        } else {
          setLocationError('Unable to detect location. Please enter your address manually.');
        }
      },
      { enableHighAccuracy: true }
    );
  };

  const handleMapSelect = async (selectedLat, selectedLng) => {
    setLat(selectedLat);
    setLng(selectedLng);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${selectedLat}&lon=${selectedLng}&format=json`);
      const data = await res.json();
      if (data.display_name) set('pickup_address', data.display_name);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    let image_url = '';
    if (imageFile) {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
      image_url = file_url;
      setUploading(false);
    }
    await base44.entities.Donation.create({
      ...form,
      freshness_hours: form.freshness_hours ? Number(form.freshness_hours) : undefined,
      donor_email: userEmail,
      donor_name: userName,
      status: 'available',
      pickup_lat: lat || undefined,
      pickup_lng: lng || undefined,
      image_url,
    });
    setPosting(false);
    setForm({ title: '', quantity: '', category: '', freshness_hours: '', pickup_address: '', description: '' });
    setImageFile(null);
    setLat(null);
    setLng(null);
    setShowMap(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('post_donation_title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>{t('food_name_label')}</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder={t('food_name_placeholder')} required />
            </div>
            <div>
              <Label>{t('quantity_label')}</Label>
              <Input value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder={t('quantity_placeholder')} required />
            </div>
            <div>
              <Label>{t('freshness_label')}</Label>
              <Input type="number" value={form.freshness_hours} onChange={e => set('freshness_hours', e.target.value)} placeholder={t('freshness_placeholder')} />
            </div>
            <div className="col-span-2">
              <Label>{t('category_label')}</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{t(c.labelKey)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t('pickup_address_label')}</Label>
            <div className="flex gap-2 mt-1">
              <Input value={form.pickup_address} onChange={e => set('pickup_address', e.target.value)} placeholder={t('pickup_address_placeholder')} required className="flex-1" />
              <Button type="button" variant="outline" size="icon" onClick={handleDetectLocation} disabled={detecting} title={t('use_my_location')}>
                {detecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => setShowMap(v => !v)} title={t('pick_on_map')}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            {lat && lng && (
              <p className="text-xs text-accent mt-1">✓ {t('location_confirmed')}: {lat.toFixed(5)}, {lng.toFixed(5)}</p>
            )}
            {locationError && (
              <p className="text-xs text-destructive mt-1">{locationError}</p>
            )}
          </div>

          {showMap && (
            <LocationPickerMap lat={lat} lng={lng} onLocationSelect={handleMapSelect} hint={t('map_click_hint')} />
          )}

          <div>
            <Label>{t('description_label')}</Label>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t('description_placeholder')} rows={2} />
          </div>

          <div>
            <Label>{t('food_photo_label')}</Label>
            <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="mt-1" />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={posting || uploading}>
            {(posting || uploading) ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />{uploading ? t('uploading') : t('posting')}</> : t('post_donation_btn')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Star, Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';

const ORGANIZATIONS = [
  {
    name: 'DESIRE Society',
    address: 'D. No.27-3-189, Gajuwaka Bypass Rd, Official Colony, Sri Nagar, Gajuwaka, Visakhapatnam, Andhra Pradesh 530044, India',
    phone: '+91 95051 17777',
    email: 'info@desiresociety.org',
    lat: 17.676893,
    lng: 83.191766,
    url: 'http://www.desiresociety.org/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    star_count: 4.7,
    rating_count: 36,
    zip: '530044',
    category: 'Orphanages',
  },
  {
    name: 'Manasu Orphanage',
    address: '21-167, Simhachalam Rd, Srinivas Nagar, Prahaladapuram, Simhachalam, Visakhapatnam, Andhra Pradesh 530029, India',
    phone: '+91 94946 68723',
    email: 'director@kidpower.org.in',
    lat: 17.7672256,
    lng: 83.2271049,
    url: 'http://www.kidpower.org.in/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    star_count: 4.5,
    rating_count: 20,
    zip: '530029',
    category: 'Orphanages',
  },
  {
    name: 'SHIRDI SAI GANAGA MANDIR',
    address: 'VQ3X+FFW, Vemulabanda, Andhra Pradesh 523265, India',
    phone: '+91 95739 16586',
    email: 'maildrop@ssgmv.org',
    lat: 15.8537492,
    lng: 79.7987049,
    url: 'http://www.ssgmv.org/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: '',
    star_count: 5,
    rating_count: 3,
    zip: '523265',
    category: 'Orphanages',
  },
  {
    name: 'Krupa Sadhana Charitable Trust',
    address: 'Old madhura wada metta, near govt school, opp. bank of baroda, Midhilapuri Vuda Colony, Madhurawada, Visakhapatnam, Andhra Pradesh 530041, India',
    phone: '+91 70133 47587',
    email: 'krupasadhana8787@gmail.com',
    lat: 17.8044029,
    lng: 83.3654051,
    url: 'http://kscharitabletrust.org/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    star_count: 4.6,
    rating_count: 50,
    zip: '530041',
    category: 'Orphanages',
  },
  {
    name: 'Love-N-Care Ministries',
    address: 'R83W+PVR, Love-N-Care Ministries, Pothinamallayya Palem, Visakhapatnam, Andhra Pradesh 530041, India',
    phone: '+91 89127 81540',
    email: 'lnc@lncministries.org',
    lat: 17.8043703,
    lng: 83.3471559,
    url: 'https://lncministries.org/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    star_count: 4.6,
    rating_count: 11,
    zip: '530041',
    category: 'Orphanages',
  },
  {
    name: 'CHILD ORPHANAGE',
    address: 'Jupudi, road, Brahmanakoduru, Andhra Pradesh 522212, India',
    phone: '+91 85550 34533',
    email: 'childsamlal@gmail.com',
    lat: 16.1446683,
    lng: 80.5123702,
    url: 'http://www.child-india.org/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    star_count: 4.9,
    rating_count: 189,
    zip: '522212',
    category: 'Orphanages',
  },
  {
    name: 'New Compassion For India Trust',
    address: 'PPT Indian Oil petrol station, 6-166/1, Gowtham Nagar, Vepagunta, Visakhapatnam, Andhra Pradesh 530029, India',
    phone: '+91 99510 87809',
    email: 'info@newcompassionforindia.in',
    lat: 17.7713685,
    lng: 83.2190181,
    url: 'http://newcompassionforindia.in/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    star_count: 5,
    rating_count: 7,
    zip: '530029',
    category: 'Orphanages',
  },
  {
    name: 'Uplift A Child Organization',
    address: 'AU Quarters 2-44-22 Sivajipalem Road Behind task Force Police station, Sector 11, MVP Colony, Visakhapatnam, Andhra Pradesh 530003, India',
    phone: '+91 98495 17707',
    email: 'info@upliftachild.org',
    lat: 17.7336081,
    lng: 83.3313522,
    url: 'http://upliftachild.org/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    star_count: 3.9,
    rating_count: 7,
    zip: '530003',
    category: 'Orphanages',
  },
  {
    name: "CARMEL CHILDREN'S HOME",
    address: 'W9GH+6GW, GNT Road, Andhra Pradesh 534112, India',
    phone: '+91 88122 33264',
    email: 'johnsukumarp@gmail.com',
    lat: 16.9256151,
    lng: 81.37884,
    url: 'http://carmelchildrenshome.wordpress.com/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: '',
    star_count: 0,
    rating_count: 0,
    zip: '534112',
    category: 'Orphanages',
  },
  {
    name: 'Shri Shirdi Sai Spiritual & Service Society',
    address: 'opp. to Bhashyam (within 200 metres, Andhra Pradesh 522034, India',
    phone: '+91 94400 00588',
    email: 'info@shrishirdisaisociety.org',
    lat: 16.3380321,
    lng: 80.4479557,
    url: 'https://shrishirdisaisociety.org/contact-us/',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    star_count: 4.3,
    rating_count: 3,
    zip: '522034',
    category: 'Orphanages',
  },
];

function StarRating({ score, count }) {
  if (count === 0) return <span className="text-xs text-muted-foreground">No ratings yet</span>;
  return (
    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      {score.toFixed(1)}
      <span className="text-muted-foreground font-normal">({count})</span>
    </span>
  );
}

export default function Organizations() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = ORGANIZATIONS.filter(org => {
    const q = query.toLowerCase();
    return (
      org.name.toLowerCase().includes(q) ||
      org.city.toLowerCase().includes(q) ||
      org.state.toLowerCase().includes(q) ||
      org.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('organizations_title')}</h1>
            <p className="text-sm text-muted-foreground">{t('organizations_sub')}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t('search_organizations')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Count badge */}
      <p className="text-xs text-muted-foreground mb-4">
        {filtered.length} {filtered.length === 1 ? 'organization' : 'organizations'}
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-2xl">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">{t('no_results')}</h3>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((org, idx) => (
            <div
              key={idx}
              className="bg-card border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Name + badge */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground leading-snug">{org.name}</h3>
                <Badge variant="outline" className="text-[10px] shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                  {org.category}
                </Badge>
              </div>

              {/* Rating */}
              <StarRating score={org.star_count} count={org.rating_count} />

              {/* Location */}
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                <span>
                  {org.city ? `${org.city}, ` : ''}{org.state}
                  {org.zip ? ` – ${org.zip}` : ''}
                </span>
              </div>

              {/* Address */}
              <p className="text-xs text-muted-foreground line-clamp-2">{org.address}</p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-auto pt-1">
                <a href={`tel:${org.phone}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <Phone className="w-3 h-3" /> {t('call_org')}
                  </Button>
                </a>
                <a href={`mailto:${org.email}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <Mail className="w-3 h-3" /> {t('email_org')}
                  </Button>
                </a>
                <a href={org.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button size="sm" className="w-full gap-1.5 text-xs bg-primary hover:bg-primary/90 text-white">
                    <Globe className="w-3 h-3" /> {t('visit_website')}
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

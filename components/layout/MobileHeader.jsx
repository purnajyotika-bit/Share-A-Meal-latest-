import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';

const CHILD_ROUTES = ['/donation/', '/delivery/', '/profile', '/analytics', '/leaderboard', '/fundraising', '/organizations'];

export default function MobileHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isChild = CHILD_ROUTES.some(r => pathname.startsWith(r));

  const TITLES = {
    '/profile':       'nav_profile',
    '/analytics':     'nav_analytics',
    '/leaderboard':   'nav_leaderboard',
    '/fundraising':   'nav_fundraising',
    '/nearby':        'nav_nearby',
    '/dashboard':     'nav_dashboard',
    '/organizations': 'nav_organizations',
  };

  const titleKey = Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ||
    (pathname.startsWith('/donation/') ? 'page_donation_detail' : pathname.startsWith('/delivery/') ? 'page_delivery' : '');

  return (
    <div className="md:hidden flex items-center h-12 px-3 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {isChild ? (
        <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      ) : (
        <Link to="/" className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-primary/30 bg-primary/10">
            <img
              src="https://media.base44.com/images/public/6a017c522945d53d0a49d427/b7df7c42b_ChatGPTImageJun4202607_14_22PM.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      )}
      <span className="font-semibold text-sm text-foreground flex-1">{titleKey ? t(titleKey) : ''}</span>
    </div>
  );
}

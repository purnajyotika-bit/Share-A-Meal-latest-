import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, MapPin, User, Building2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  const TABS = [
    { to: '/',               icon: Home,           labelKey: 'nav_home' },
    { to: '/dashboard',      icon: LayoutDashboard, labelKey: 'nav_dashboard' },
    { to: '/nearby',         icon: MapPin,          labelKey: 'nav_nearby' },
    { to: '/organizations',  icon: Building2,       labelKey: 'nav_organizations' },
    { to: '/profile',        icon: User,            labelKey: 'nav_profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {TABS.map(({ to, icon: Icon, labelKey }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 select-none transition-colors
              ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
              <span className="text-[9px] font-medium leading-tight text-center">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

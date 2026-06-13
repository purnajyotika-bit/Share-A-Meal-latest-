import { useState, useEffect } from 'react';

/**
 * Returns remaining milliseconds until expiry (based on created_date + freshness_hours).
 * Returns null if the donation has no freshness window.
 * Triggers onExpire callback when it hits zero.
 */
export function useExpiryCountdown(donation, onExpire) {
  const getRemaining = () => {
    if (!donation?.freshness_hours || !donation?.created_date) return null;
    const expiresAt = new Date(donation.created_date).getTime() + donation.freshness_hours * 3600 * 1000;
    return Math.max(0, expiresAt - Date.now());
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (remaining === null) return;
    if (remaining === 0) {
      onExpire?.();
      return;
    }
    const interval = setInterval(() => {
      setRemaining(prev => {
        const next = getRemaining();
        if (next === 0) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [donation?.id]);

  return remaining;
}

export function formatCountdown(ms) {
  if (ms === null) return null;
  if (ms <= 0) return 'Expired';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}

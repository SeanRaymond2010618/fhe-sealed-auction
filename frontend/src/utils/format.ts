import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

// Format Ethereum values
export const formatEther = (value: string): string => {
  const num = parseFloat(value) / 1e18;
  if (num >= 1000) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format time
export const formatTimestamp = (timestamp: number): string => {
  return dayjs(timestamp).format('MMM DD, YYYY HH:mm');
};

export const formatRelativeTime = (timestamp: number): string => {
  return dayjs(timestamp).fromNow();
};

export const formatDuration = (seconds: number): string => {
  const duration = dayjs.duration(seconds, 'seconds');
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }
};

export const getTimeRemaining = (endTime: number): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} => {
  const total = endTime - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total: Math.max(0, total),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    expired: total <= 0,
  };
};

// Format auction type
export const formatAuctionType = (type: string): string => {
  const types: Record<string, string> = {
    'sealed-bid': 'Sealed Bid',
    'english': 'English',
    'dutch': 'Dutch',
    'batch': 'Batch',
  };
  return types[type] || type;
};

// Format status
export const formatStatus = (status: string): {
  text: string;
  color: string;
} => {
  const statuses: Record<string, { text: string; color: string }> = {
    pending: { text: 'Pending', color: 'default' },
    active: { text: 'Active', color: 'processing' },
    ended: { text: 'Ended', color: 'warning' },
    cancelled: { text: 'Cancelled', color: 'error' },
    settled: { text: 'Settled', color: 'success' },
  };
  return statuses[status] || { text: status, color: 'default' };
};

// Calculate current Dutch auction price
export const calculateDutchPrice = (
  startPrice: string,
  priceDecrement: string,
  decrementInterval: number,
  startTime: number
): string => {
  const elapsed = Date.now() - startTime;
  const intervals = Math.floor(elapsed / (decrementInterval * 1000));
  const decrement = BigInt(priceDecrement) * BigInt(intervals);
  const current = BigInt(startPrice) - decrement;
  return current > 0n ? current.toString() : '0';
};
export const getRoomCapacity = (room) => {
  if (!room) return 0;

  const coerceInt = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) return Math.trunc(parsed);
    }
    return null;
  };

  const cap = coerceInt(room.capacity);
  if (cap !== null) return Math.min(MAX_LISTING_CAPACITY, Math.max(0, cap));

  // Backwards compatibility for older documents that used boolean `available`
  if (room.available === false) return 0;
  if (room.available === true) return 1;

  // Default assumption if neither exists
  return 1;
};

// Business rule: listings should not exceed this many total spaces.
export const MAX_LISTING_CAPACITY = 100;

export const getRoomMaxCapacity = (room) => {
  if (!room) return 0;

  const coerceInt = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) return Math.trunc(parsed);
    }
    return null;
  };

  const max = coerceInt(room.maxCapacity ?? room.totalCapacity);
  if (max !== null) return Math.min(MAX_LISTING_CAPACITY, Math.max(0, max));

  const cap = getRoomCapacity(room);
  return cap;
};

export const isRoomAvailable = (room) => getRoomCapacity(room) > 0;

// Listing type helper:
// - Primary signal: explicit boolean `isCommercial` saved on the room document.
// - Fallback (older docs): infer commercial if capacity/maxCapacity indicates multiple spaces.
export const isCommercialListing = (room) => {
  if (!room) return false;
  if (room.isCommercial === true) return true;
  if (room.isCommercial === false) return false;

  return getRoomMaxCapacity(room) > 1 || getRoomCapacity(room) > 1;
};

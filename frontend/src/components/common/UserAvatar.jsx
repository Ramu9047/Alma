import React, { useState } from 'react';

/**
 * UserAvatar — Reliable Avatar component with automatic initials fallback & gradient styling.
 * Prevents broken image icons if network fails or avatar URL is missing.
 */
export default function UserAvatar({ user, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    // Remove title prefix like "Dr." or "Prof." if present
    const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = cleanName.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const avatarSize = sizeClasses[size] || sizeClasses.md;
  const initials = getInitials(user?.name || user?.username);

  // If avatar image URL is provided and has not failed loading yet
  if (user?.avatar && !imgError) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'User Avatar'}
        onError={() => setImgError(true)}
        className={`${avatarSize} rounded-full border-2 border-cobalt/40 object-cover shadow-sm ${className}`}
      />
    );
  }

  // Stylish fallback badge with initials and gradient background
  return (
    <div
      className={`${avatarSize} rounded-full bg-gradient-to-tr from-cobalt-deep via-cobalt to-indigo-500 text-white font-bold font-mono flex items-center justify-center border-2 border-cobalt/30 shadow-sm flex-shrink-0 select-none ${className}`}
      title={user?.name || user?.username}
    >
      {initials}
    </div>
  );
}

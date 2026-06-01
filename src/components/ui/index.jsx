import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/helpers';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    brand: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  };
  return (
    <span className={cn('badge', variants[variant], className)}>{children}</span>
  );
}

export function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function Empty({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
        style={{ background: 'var(--surface-2)' }}>
        {icon}
      </div>
      <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>{title}</h3>
      {description && <p className="text-sm mb-4 max-w-xs" style={{ color: 'var(--text-3)' }}>{description}</p>}
      {action}
    </div>
  );
}

export function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="60" strokeDashoffset="20" />
    </svg>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  React.useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn('relative w-full rounded-2xl border-0 p-6 shadow-2xl shadow-black/45 animate-slide-up', sizes[size])}
        style={{
          background: 'linear-gradient(145deg, rgba(16,22,37,0.98), rgba(8,13,25,0.98))',
          boxShadow: '0 28px 80px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.035)'
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-700">{title}</h2>
          <button onClick={onClose} className="btn btn-secondary btn-sm !px-2 !py-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function Select({ value, onChange, options, className, disabled = false, placeholder }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredOption, setHoveredOption] = React.useState(null);
  const dropdownRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const [buttonWidth, setButtonWidth] = React.useState('auto');
  
  const selectedOption = options.find(opt => opt.value === value);
  
  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(`${buttonRef.current.offsetWidth}px`);
    }
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setHoveredOption(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIsOpen(true); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIsOpen(false); }
    if (e.key === 'Escape') setIsOpen(false);
  };

  const hasFullWidth = className?.includes('w-full');

  return (
    <div ref={dropdownRef} className={cn('relative', hasFullWidth ? 'w-full' : 'w-auto')}>
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'px-4 py-2 rounded-xl border text-sm font-medium text-left transition-all duration-200 flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:border-[var(--text-3)] active:scale-95',
          hasFullWidth ? 'w-full' : 'w-auto'
        )}
        style={{
          background: isOpen ? 'var(--surface-2)' : 'var(--surface)',
          borderColor: isOpen ? 'var(--brand)' : 'var(--border)',
          color: selectedOption ? 'var(--text)' : 'var(--text-3)',
          boxShadow: isOpen ? '0 0 0 3px var(--brand-light)' : 'none'
        }}
        onMouseEnter={(e) => !isOpen && (e.currentTarget.style.borderColor = 'var(--text-3)')}
        onMouseLeave={(e) => !isOpen && (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <span className="truncate">{selectedOption?.label || placeholder || 'Select...'}</span>
        <svg
          className="transition-transform duration-200 flex-shrink-0"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 rounded-xl border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            width: buttonWidth,
            minWidth: '200px'
          }}
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((opt, idx) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHoveredOption(opt.value)}
                onMouseLeave={() => setHoveredOption(null)}
                className="w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-150 flex items-center gap-3 relative"
                style={{
                  background: 
                    value === opt.value ? 'var(--brand-light)' : 
                    hoveredOption === opt.value ? 'var(--surface-2)' : 
                    'transparent',
                  color: value === opt.value ? 'var(--brand)' : 'var(--text)',
                  borderBottom: idx < options.length - 1 ? '1px solid var(--border)' : 'none',
                  transform: hoveredOption === opt.value ? 'translateX(4px)' : 'translateX(0)',
                  paddingLeft: hoveredOption === opt.value ? 'calc(1rem + 4px)' : '1rem'
                }}
              >
                {value === opt.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0">
                    <path d="M20 6l-11 11-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className={cn('truncate', value === opt.value ? 'font-semibold' : '')}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-2)' }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            active === tab.value
              ? 'bg-white dark:bg-gray-800 shadow-sm'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
          )}
          style={{ color: active === tab.value ? 'var(--text)' : 'var(--text-2)' }}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className="badge" style={{
              background: active === tab.value ? 'var(--brand-light)' : 'var(--border)',
              color: active === tab.value ? 'var(--brand)' : 'var(--text-3)',
              fontSize: '11px', padding: '2px 7px'
            }}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Progress({ value, max = 100, className }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full h-2 rounded-full overflow-hidden', className)}
      style={{ background: 'var(--border)' }}>
      <div className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--brand)'
        }} />
    </div>
  );
}

export { default as PricingModal } from './PricingModal';

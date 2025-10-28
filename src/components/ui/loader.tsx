import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  variant?: 'default' | 'page' | 'inline' | 'button' | 'logo';
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Loader({ 
  variant = 'default', 
  text, 
  size = 'md',
  className 
}: LoaderProps) {
  
  // Size mappings
  const sizeMap = {
    sm: { icon: 'h-4 w-4', text: 'text-sm', logo: 'w-8 h-8' },
    md: { icon: 'h-6 w-6', text: 'text-base', logo: 'w-12 h-12' },
    lg: { icon: 'h-8 w-8', text: 'text-lg', logo: 'w-16 h-16' },
    xl: { icon: 'h-12 w-12', text: 'text-xl', logo: 'w-24 h-24' },
  };

  // Page loader (full screen with logo)
  if (variant === 'page') {
    return (

      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className={cn(sizeMap[size].logo, 'mx-auto mb-4 animate-pulse')}>
            <Image
              src="/avs-logo.png"
              alt="AVS Logo"
              width={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
              height={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
              className="object-contain"
            />
          </div>
          {text && <p className={cn('text-gray-600', sizeMap[size].text)}>{text}</p>}
        </div>
      </div>
    );
  }

  // Logo variant (animated logo)
  if (variant === 'logo') {
    return (
      <div className={cn('text-center', className)}>
        <div className={cn(sizeMap[size].logo, 'mx-auto mb-4 animate-pulse')}>
          <Image
            src="/avs-logo.png"
            alt="AVS Logo"
            width={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
            height={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
            className="object-contain"
          />
        </div>
        {text && <p className={cn('text-gray-600', sizeMap[size].text)}>{text}</p>}
      </div>
    );
  }

  // Button loader (inline with text)
  if (variant === 'button') {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <Loader2 className={cn(sizeMap[size].icon, 'animate-spin mr-2')} />
        {text && <span>{text}</span>}
      </span>
    );
  }

  // Inline loader
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Loader2 className={cn(sizeMap[size].icon, 'animate-spin text-[#E63946]')} />
        {text && <span className={cn(sizeMap[size].text, 'text-gray-700')}>{text}</span>}
      </div>
    );
  }

  // Default spinner loader
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn(sizeMap[size].icon, 'animate-spin text-[#E63946]')} />
      {text && <span className={cn('ml-2', sizeMap[size].text, 'text-gray-700')}>{text}</span>}
    </div>
  );
}

// Legacy loader for admin pages (gradient circle)
export function AdminLoader({ text = 'Loading...', size = 'lg' }: { text?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-base',
    md: 'w-14 h-14 text-lg',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center">
      <div className="text-center">
        <div className={cn(sizeClasses[size], 'mx-auto avs-gradient rounded-full flex items-center justify-center mb-4 animate-pulse')}>
          <span className="text-white font-bold">AVS</span>
        </div>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}


export default Loader;


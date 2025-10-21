// Antonio SJ
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-12 w-12', className)}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M26.5 18C26.5 15.3 28.3333 14.5 30 14.5C32.5 14.5 35.5 16 35.5 21C35.5 28.5 26.5 30 26.5 30V42H16.5V18H26.5Z" 
            stroke="hsl(var(--primary))" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
        <path 
            d="M16.5 12V9C16.5 7.5 17 6 20.5 6C23.5 6 25.5 7 26.5 9V12" 
            stroke="hsl(var(--primary))" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
        <rect x="19" y="11" width="2" height="2" rx="1" fill="hsl(var(--primary))"/>
        <rect x="24" y="11" width="2" height="2" rx="1" fill="hsl(var(--primary))"/>
        <path 
            d="M22 6V4.5" 
            stroke="hsl(var(--primary))" 
            strokeWidth="2" 
            strokeLinecap="round"
        />
        <path
            d="M20 3.5H24"
            stroke="hsl(var(--primary))" 
            strokeWidth="2" 
            strokeLinecap="round"
        />
        <path 
            d="M32 9C34.6667 9 38 10 40 12.5" 
            stroke="hsl(var(--primary))" 
            strokeWidth="4" 
            strokeLinecap="round" 
        />
        <path 
            d="M31 14C32.6667 14 35 14.6667 36.5 16" 
            stroke="hsl(var(--primary))" 
            strokeWidth="4" 
            strokeLinecap="round" 
        />
        <path 
            d="M30 4C34.6667 4.16667 41.5 6.5 44 10" 
            stroke="hsl(var(--primary))" 
            strokeWidth="4" 
            strokeLinecap="round" 
        />
    </svg>
  );
}

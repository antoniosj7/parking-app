// Antonio SJ
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-12 w-12', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        className="fill-primary/20 stroke-primary stroke-2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="10.5"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-primary font-headline font-bold text-sm"
      >
        P
      </text>
    </svg>
  );
}

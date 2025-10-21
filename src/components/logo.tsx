// Antonio SJ
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return <Bot className={cn('h-12 w-12 text-primary', className)} />;
}

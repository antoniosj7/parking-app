import Link from 'next/link';
import { Bot } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/grid" className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            PUMG
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm lg:flex lg:gap-6">
          <Link
            href="/grid"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Parking Grid
          </Link>
          <Link
            href="/admin"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Admin
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/">Logout</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

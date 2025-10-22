import { cn } from "@/lib/utils";

export function QIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-q-icon", className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0v5a2.5 2.5 0 0 0 5 0" />
      <path d="M12.5 14.5L16 18" />
    </svg>
  );
}

// This page is now part of the user-facing app area.
// The content is now served from /app/parking/page.tsx
// This file can be deleted or kept as a redirect.
import { redirect } from 'next/navigation';

export default function OldGridPage() {
    redirect('/app/parking');
}

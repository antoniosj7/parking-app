// This page is no longer the main dashboard, redirect to the parking view.
import { redirect } from 'next/navigation';

export default function AdminRootPage() {
    redirect('/admin/parking');
}

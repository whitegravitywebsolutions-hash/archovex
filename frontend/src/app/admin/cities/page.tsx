import { redirect } from 'next/navigation';

export default function LegacyAdminCitiesPage() {
  redirect('/admin/locations');
}

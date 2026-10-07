import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { categorySlug, postSlug } = await params;
  redirect(`/blogs/${categorySlug}/${postSlug}`);
}

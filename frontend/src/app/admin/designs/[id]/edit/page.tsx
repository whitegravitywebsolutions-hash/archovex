'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LegacyAdminEditDesignPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/admin/blogs/${params.id}/edit`);
    }
  }, [params, router]);

  return null;
}

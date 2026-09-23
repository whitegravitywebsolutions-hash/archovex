'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DesignForm from '../../DesignForm';
import { apiClient } from '@/lib/api';
import { DesignPost } from '@/types';

export default function EditDesignPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<DesignPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiClient.get(`/admin/design-posts/${id}`).then((res) => {
        if (res.data.success) {
          setPost(res.data.data);
        }
      }).catch((err) => console.error(err)).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-xs font-bold text-slate-500 animate-pulse">Loading design data...</div>;

  return <DesignForm initialData={post} />;
}

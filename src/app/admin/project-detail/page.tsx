'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ProjectDetailRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  useEffect(() => {
    // Redirect to the new route pattern
    if (projectId) {
      router.replace(`/admin/projects/${projectId}`);
    } else {
      router.replace('/admin/projects');
    }
  }, [projectId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Redirecting...</div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-gray-600">Loading...</div></div>}>
      <ProjectDetailRedirect />
    </Suspense>
  );
}

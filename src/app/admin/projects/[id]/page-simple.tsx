'use client';

import { useParams, useRouter } from 'next/navigation';

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="p-6">
      <button
        onClick={() => router.push('/admin/projects')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Projects
      </button>
      
      <h1 className="text-2xl font-bold mb-4">Project #{projectId}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Simple project page loaded successfully!</p>
        <p className="mt-2">Project ID: {projectId}</p>
      </div>
    </div>
  );
}

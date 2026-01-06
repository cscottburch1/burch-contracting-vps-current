'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  customer_name: string;
}

interface Photo {
  id: number;
  filename: string;
  category: string;
  caption: string | null;
  created_at: string;
}

export default function ProjectPhotoUploadPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<'progress' | 'before' | 'after' | 'other'>('progress');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const [projectRes, photosRes] = await Promise.all([
        fetch(`/api/admin/projects/${projectId}`),
        fetch(`/api/admin/projects/${projectId}/photos`)
      ]);

      if (!projectRes.ok) {
        router.push('/tradesman/dashboard');
        return;
      }

      const projectData = await projectRes.json();
      setProject({
        id: projectData.project.id,
        title: projectData.project.title,
        customer_name: projectData.project.customer_name || 'Unknown'
      });

      if (photosRes.ok) {
        const photosData = await photosRes.json();
        setPhotos(photosData.photos || []);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      let successCount = 0;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('caption', caption || `Uploaded from mobile - ${new Date().toLocaleDateString()}`);

        const response = await fetch(`/api/admin/projects/${projectId}/photos`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          successCount++;
        }

        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      if (successCount > 0) {
        alert(`✅ Successfully uploaded ${successCount} photo(s)!`);
        setSelectedFiles([]);
        setCaption('');
        await loadProjectData();
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
      } else {
        alert('❌ Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed. Please check your connection.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/tradesman/dashboard" className="flex items-center text-blue-100 hover:text-white mb-2">
            <span className="text-xl">←</span>
            <span className="ml-2 text-sm">Back to Projects</span>
          </Link>
          <h1 className="text-xl font-bold">{project?.title}</h1>
          <p className="text-blue-100 text-sm">{project?.customer_name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📸 Upload Photos</h2>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Action Buttons */}
          {selectedFiles.length === 0 ? (
            <div className="space-y-3">
              <button
                onClick={openCamera}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3 text-lg shadow-lg"
              >
                <span className="text-2xl">📷</span>
                Take Photo
              </button>
              <button
                onClick={openGallery}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3 text-lg shadow-lg"
              >
                <span className="text-2xl">🖼️</span>
                Choose from Gallery
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Files */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-2">
                  ✓ {selectedFiles.length} photo(s) selected
                </p>
                <div className="text-sm text-blue-700 space-y-1">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="truncate">• {file.name}</div>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="progress">Progress Update</option>
                  <option value="before">Before</option>
                  <option value="after">After</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFiles([])}
                  disabled={uploading}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Photos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Photos ({photos.length})
          </h2>
          
          {photos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No photos yet. Be the first to upload!</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.slice(0, 10).map((photo) => (
                <div key={photo.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`/uploads/${photo.filename}`}
                    alt={photo.caption || 'Project photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                    <span className="inline-block px-2 py-0.5 bg-blue-600 rounded text-xs">
                      {photo.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

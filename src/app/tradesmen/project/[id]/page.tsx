'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

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
  const projectId = (params?.id as string) || '';
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
      const [projectsRes, photosRes] = await Promise.all([
        fetch(`/api/tradesmen/projects`),
        fetch(`/api/tradesmen/projects/${projectId}/photos`)
      ]);

      if (!projectsRes.ok) {
        router.push('/tradesmen/dashboard');
        return;
      }

      const projectsData = await projectsRes.json();
      const currentProject = projectsData.projects?.find((p: any) => p.id === parseInt(projectId));
      
      if (!currentProject) {
        router.push('/tradesmen/dashboard');
        return;
      }

      setProject({
        id: currentProject.id,
        title: currentProject.title,
        customer_name: currentProject.customer_name || 'Unknown'
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

        const response = await fetch(`/api/tradesmen/projects/${projectId}/photos`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          successCount++;
        }

        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} photo(s)!`);
        setSelectedFiles([]);
        setCaption('');
        await loadProjectData();

        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please check your connection.');
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-5 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/tradesmen/dashboard" className="flex items-center text-blue-100 hover:text-white mb-2 group">
            <span className="text-xl group-hover:translate-x-[-4px] transition-transform">←</span>
            <span className="ml-2 text-sm sm:text-base font-medium">Back to Projects</span>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold leading-tight">{project?.title}</h1>
          <p className="text-blue-100 text-sm sm:text-base">{project?.customer_name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📸</span>
            Upload Photos
          </h2>

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
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={openCamera}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] text-white font-bold py-5 sm:py-6 rounded-xl flex items-center justify-center gap-3 text-lg sm:text-xl shadow-xl transition-all"
              >
                <span className="text-4xl">📷</span>
                Take Photo
              </button>
              <button
                onClick={openGallery}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 active:scale-[0.98] text-white font-bold py-5 sm:py-6 rounded-xl flex items-center justify-center gap-3 text-lg sm:text-xl shadow-xl transition-all"
              >
                <span className="text-4xl">🖼️</span>
                Choose from Gallery
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* Selected Files */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 sm:p-5">
                <p className="font-bold text-blue-900 mb-2 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  {selectedFiles.length} photo(s) selected
                </p>
                <div className="text-sm sm:text-base text-blue-700 space-y-1 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="truncate">• {file.name}</div>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                  Photo Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-4 sm:py-5 border-2 border-gray-300 rounded-xl text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="progress">📊 Progress Update</option>
                  <option value="before">⏪ Before</option>
                  <option value="after">⏩ After</option>
                  <option value="other">📂 Other</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a description..."
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm sm:text-base font-semibold text-gray-700 mt-3 flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedFiles([])}
                  disabled={uploading}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-[0.98] text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base sm:text-lg transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📤</span>
                      Upload Photos
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Photos */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            Recent Photos ({photos.length})
          </h2>
          
          {photos.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-gray-300 text-6xl mb-3">📷</div>
              <p className="text-gray-500 text-sm sm:text-base">No photos yet. Be the first to upload!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {photos.slice(0, 12).map((photo) => (
                <div key={photo.id} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={`/uploads/${photo.filename}`}
                    alt={photo.caption || 'Project photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span className="inline-block px-2.5 py-1 bg-blue-600 rounded-lg text-xs font-semibold text-white shadow-lg">
                      {photo.category}
                    </span>
                    {photo.caption && (
                      <p className="text-white text-xs mt-1 truncate">{photo.caption}</p>
                    )}
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

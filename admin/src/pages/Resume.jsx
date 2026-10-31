import { useState, useEffect } from 'react';
import { FileText, Upload, Calendar, CheckCircle2, X } from 'lucide-react';
import { resumeService } from '../services/dataService';

export default function Resume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isUploadingMode, setIsUploadingMode] = useState(false);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getResume();
      setResumeData(data);
    } catch (error) {
      console.error('Failed to fetch resume', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setSuccessMsg('');
      const url = URL.createObjectURL(file);
      setPreviewPdfUrl(url);
      setIsUploadingMode(true);
      setIsPreviewModalOpen(true);
    } else {
      alert('Please select a valid PDF file.');
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const resumeDto = {
        filename: selectedFile.name,
        url: '/api/public/resume/file',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      const updatedResume = await resumeService.uploadResume(resumeDto);
      setResumeData(updatedResume);
      setSuccessMsg('Resume uploaded successfully!');
      setSelectedFile(null);
      setIsPreviewModalOpen(false);
      // Reset file input
      document.getElementById('resume-upload').value = null;
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground p-12">Loading resume data...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Resume</h2>
        <p className="text-muted-foreground mt-2">Update the public resume PDF available for download on your portfolio.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div 
          className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center text-center justify-center space-y-4 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => {
            if (resumeData?.url) {
              setPreviewPdfUrl(resumeData.url);
              setIsUploadingMode(false);
              setIsPreviewModalOpen(true);
            }
          }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Active Resume</h3>
            <p className="text-primary font-medium mt-1">{resumeData?.filename || 'No resume uploaded'}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4" />
            Last Updated: {resumeData?.lastUpdated || 'N/A'}
          </div>
          {resumeData?.url && (
            <div className="text-xs text-muted-foreground mt-2 break-all pointer-events-none">
              Click to preview
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-4">Upload New Version</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
              <input 
                type="file" 
                id="resume-upload" 
                accept="application/pdf" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="font-medium">Click to select PDF</span>
                <span className="text-xs text-muted-foreground mt-1">Strictly .pdf files only</span>
              </label>
            </div>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-secondary rounded-md text-sm font-medium flex items-center justify-between">
                <span className="truncate">{selectedFile.name}</span>
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    document.getElementById('resume-upload').value = null;
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {successMsg && (
              <div className="mt-4 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {successMsg}
              </div>
            )}
          </div>


        </div>
      </div>

      {/* PDF Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground rounded-lg border border-border shadow-lg w-full max-w-4xl h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-lg">
                {isUploadingMode ? 'Confirm Upload' : 'Preview Resume'}
              </h3>
              <button 
                onClick={() => setIsPreviewModalOpen(false)} 
                className="opacity-70 hover:opacity-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-0 bg-muted/30 overflow-hidden">
              <iframe 
                src={previewPdfUrl} 
                className="w-full h-full border-0" 
                title="PDF Preview"
              />
            </div>
            
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              <button 
                onClick={() => setIsPreviewModalOpen(false)} 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
              >
                {isUploadingMode ? 'Cancel' : 'Close'}
              </button>
              {isUploadingMode && (
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10 px-4 py-2"
                >
                  {uploading ? 'Uploading...' : 'Confirm & Upload'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projectService } from '../services/dataService';
import ConfirmModal from '../components/ConfirmModal';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.string().min(1, 'At least one tag is required (comma-separated)'),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageUrlsString: z.string().optional(),
});

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: true });
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      githubUrl: '',
      liveUrl: '',
      imageUrlsString: ''
    }
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setValue('title', project.title);
      setValue('description', project.description);
      setValue('tags', project.tags);
      setValue('githubUrl', project.githubUrl || '');
      setValue('liveUrl', project.liveUrl || '');
      
      let initialImages = project.images || (project.image ? [project.image] : []);
      setValue('imageUrlsString', initialImages.join(', '));
      setPreviewImages(initialImages);
    } else {
      setEditingProject(null);
      reset();
      setPreviewImages([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
    setPreviewImages([]);
  };

  const handleImagesStringChange = (e) => {
    const urlsString = e.target.value;
    const urls = urlsString.split(',').map(url => url.trim()).filter(url => url.length > 0);
    setPreviewImages(urls);
  };

  const onSubmit = async (data) => {
    try {
      const urls = data.imageUrlsString ? data.imageUrlsString.split(',').map(u => u.trim()).filter(Boolean) : [];
      const projectData = { ...data, images: urls };
      if (editingProject) {
        await projectService.updateProject(editingProject.id, projectData);
      } else {
        await projectService.createProject(projectData);
      }
      await fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Failed to save project', error);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project?',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await projectService.deleteProject(id);
          await fetchProjects();
        } catch (error) {
          console.error('Failed to delete project', error);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Projects</h2>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground p-12">Loading projects...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
              <div className="h-48 bg-muted border-b border-border flex items-center justify-center relative group">
                {project.images && project.images.length > 0 ? (
                  <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                ) : project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openModal(project)} className="p-2 bg-white rounded-md text-black hover:bg-gray-200 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-destructive rounded-md text-white hover:bg-destructive/90 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-semibold text-xl tracking-tight mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground flex-1">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground p-12 border border-dashed rounded-xl">
              No projects found. Create one!
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground rounded-lg border border-border shadow-lg w-full max-w-2xl my-8 animate-in fade-in zoom-in-95">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-lg">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                <button type="button" onClick={closeModal} className="opacity-70 hover:opacity-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Title</label>
                  <input {...register('title')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Description</label>
                  <textarea {...register('description')} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Tags (comma-separated)</label>
                  <input {...register('tags')} placeholder="React, Node.js, Tailwind" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">GitHub URL</label>
                    <input {...register('githubUrl')} type="url" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    {errors.githubUrl && <p className="text-sm text-destructive">{errors.githubUrl.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Live URL</label>
                    <input {...register('liveUrl')} type="url" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    {errors.liveUrl && <p className="text-sm text-destructive">{errors.liveUrl.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Image URLs (comma-separated)</label>
                  <textarea {...register('imageUrlsString')} onChange={(e) => {
                    register('imageUrlsString').onChange(e);
                    handleImagesStringChange(e);
                  }} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="https://example.com/img1.png, https://example.com/img2.png" />
                  
                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {previewImages.map((src, idx) => (
                        <div key={idx} className="relative rounded-md overflow-hidden border border-border h-24 bg-muted">
                          <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-6 border-t border-border">
                <button type="button" onClick={closeModal} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Modal */}
      <ConfirmModal 
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
}

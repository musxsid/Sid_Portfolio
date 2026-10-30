import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { experienceService } from '../services/dataService';
import ConfirmModal from '../components/ConfirmModal';

const experienceSchema = z.object({
  roleTitle: z.string().min(1, 'Role title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  projectName: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().min(1, 'Description is required'),
});

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: true });
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      roleTitle: '',
      company: '',
      location: '',
      projectName: '',
      duration: '',
      description: '',
    }
  });

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const data = await experienceService.getExperience();
      setExperience(data);
    } catch (error) {
      console.error('Failed to fetch experience', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setValue('roleTitle', exp.roleTitle);
      setValue('company', exp.company);
      setValue('location', exp.location || '');
      setValue('projectName', exp.projectName || '');
      setValue('duration', exp.duration);
      setValue('description', exp.description);
    } else {
      setEditingExp(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingExp) {
        await experienceService.updateExperience(editingExp.id, data);
      } else {
        await experienceService.createExperience(data);
      }
      await fetchExperience();
      closeModal();
    } catch (error) {
      console.error('Failed to save experience', error);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Experience',
      message: 'Are you sure you want to delete this experience entry?',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await experienceService.deleteExperience(id);
          await fetchExperience();
        } catch (error) {
          console.error('Failed to delete experience', error);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Experience</h2>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground p-12">Loading experience...</div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {experience.map(exp => (
            <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm group-hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.roleTitle}</h3>
                    <div className="text-primary font-medium text-sm">{exp.company} | {exp.location}</div>
                    {exp.projectName && <div className="text-muted-foreground text-xs mt-1">Project: {exp.projectName}</div>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(exp)} className="p-1.5 bg-secondary rounded-md text-secondary-foreground hover:bg-secondary/80">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(exp.id)} className="p-1.5 bg-destructive rounded-md text-destructive-foreground hover:bg-destructive/90">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <time className="text-xs text-muted-foreground uppercase font-semibold mb-3 block">{exp.duration}</time>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {exp.description}
                </div>
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <div className="text-center text-muted-foreground p-12 border border-dashed rounded-xl relative z-10 bg-card">
              No experience entries found.
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground rounded-lg border border-border shadow-lg w-full max-w-lg my-8 animate-in fade-in zoom-in-95">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-lg">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
                <button type="button" onClick={closeModal} className="opacity-70 hover:opacity-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Role Title</label>
                  <input {...register('roleTitle')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.roleTitle && <p className="text-sm text-destructive">{errors.roleTitle.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Company</label>
                  <input {...register('company')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Location</label>
                  <input {...register('location')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Project Name (Optional)</label>
                  <input {...register('projectName')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Duration (e.g. Jan 2023 - Present)</label>
                  <input {...register('duration')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Description (Use bullet points)</label>
                  <textarea {...register('description')} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="- Built scalable web apps&#10;- Improved performance by 30%" />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-6 border-t border-border">
                <button type="button" onClick={closeModal} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Save Experience
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

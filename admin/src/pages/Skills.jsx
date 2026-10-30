import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Code2, Pencil, Check, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { skillService } from '../services/dataService';
import ConfirmModal from '../components/ConfirmModal';

const skillSchema = z.object({
  skillName: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
});

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: true });
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skillName: '',
      category: 'Frontend',
    }
  });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await skillService.getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openModal = (skill = null) => {
    reset();
    setIsNewCategory(false);
    if (skill) {
      setEditingSkill(skill);
      setValue('skillName', skill.skillName);
      setValue('category', skill.category);
    } else {
      setEditingSkill(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingSkill) {
        await skillService.updateSkill(editingSkill.id, data);
      } else {
        await skillService.createSkill(data);
      }
      await fetchSkills();
      closeModal();
    } catch (error) {
      console.error('Failed to save skill', error);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Skill',
      message: 'Are you sure you want to delete this skill?',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await skillService.deleteSkill(id);
          await fetchSkills();
        } catch (error) {
          console.error('Failed to delete skill', error);
        }
      }
    });
  };

  const handleDeleteCategory = (category) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${category}" and ALL skills inside it?`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          await skillService.deleteCategory(category);
          await fetchSkills();
        } catch (error) {
          console.error('Failed to delete category', error);
        }
      }
    });
  };

  const handleSaveCategory = async (oldCategory) => {
    if (!editCategoryName.trim() || editCategoryName === oldCategory) {
      setEditingCategory(null);
      return;
    }
    try {
      await skillService.updateCategory(oldCategory, editCategoryName.trim());
      await fetchSkills();
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category', error);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Array.from(new Set(['Frontend', 'Backend', 'Database', 'Tools', ...skills.map(s => s.category)]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Skills</h2>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground p-12">Loading skills...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map(category => (
            <div key={category} className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between min-h-[60px]">
                {editingCategory === category ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <Code2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input 
                      autoFocus
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveCategory(category);
                        if (e.key === 'Escape') setEditingCategory(null);
                      }}
                      className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                ) : (
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-muted-foreground" />
                    {category}
                  </h3>
                )}
                
                {editingCategory === category ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleSaveCategory(category)} className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="p-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button 
                      onClick={() => {
                        setEditingCategory(category);
                        setEditCategoryName(category);
                      }}
                      className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors"
                      title="Edit Category"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category)}
                      className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {groupedSkills[category]?.length > 0 ? (
                  groupedSkills[category].map(skill => (
                    <div key={skill.id} className="group flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                      {skill.skillName}
                      <button onClick={() => openModal(skill)} className="ml-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="ml-1 text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic w-full text-center py-4">No skills in this category</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground rounded-lg border border-border shadow-lg w-full max-w-md animate-in fade-in zoom-in-95">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-lg">{editingSkill ? 'Edit Skill' : 'New Skill'}</h3>
                <button type="button" onClick={closeModal} className="opacity-70 hover:opacity-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Skill Name</label>
                  <input {...register('skillName')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. React" />
                  {errors.skillName && <p className="text-sm text-destructive">{errors.skillName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Category</label>
                  {!isNewCategory ? (
                    <select 
                      {...register('category')}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setIsNewCategory(true);
                          setValue('category', '');
                        } else {
                          setValue('category', e.target.value);
                        }
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__">+ Add New Category...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        {...register('category')} 
                        placeholder="e.g. Mobile" 
                        autoFocus
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsNewCategory(false);
                          setValue('category', categories[0] || 'Frontend');
                        }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-3"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-6 border-t border-border">
                <button type="button" onClick={closeModal} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  {editingSkill ? 'Update Skill' : 'Save Skill'}
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

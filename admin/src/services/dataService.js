import api from './api';

export const projectService = {
  getProjects: async () => {
    const res = await api.get('/projects');
    return res.data;
  },
  createProject: async (project) => {
    const res = await api.post('/projects', project);
    return res.data;
  },
  updateProject: async (id, updatedProject) => {
    const res = await api.put(`/projects/${id}`, updatedProject);
    return res.data;
  },
  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
  }
};

export const experienceService = {
  getExperience: async () => {
    const res = await api.get('/experience');
    return res.data;
  },
  createExperience: async (exp) => {
    const res = await api.post('/experience', exp);
    return res.data;
  },
  updateExperience: async (id, updatedExp) => {
    const res = await api.put(`/experience/${id}`, updatedExp);
    return res.data;
  },
  deleteExperience: async (id) => {
    await api.delete(`/experience/${id}`);
  }
};

export const skillService = {
  getSkills: async () => {
    const res = await api.get('/skills');
    return res.data;
  },
  createSkill: async (skill) => {
    const res = await api.post('/skills', skill);
    return res.data;
  },
  deleteSkill: async (id) => {
    await api.delete(`/skills/${id}`);
  },
  updateCategory: async (oldCategory, newCategory) => {
    await api.put(`/skills/category?oldCategory=${encodeURIComponent(oldCategory)}&newCategory=${encodeURIComponent(newCategory)}`);
  },
  deleteCategory: async (category) => {
    await api.delete(`/skills/category?category=${encodeURIComponent(category)}`);
  },
  updateSkill: async (id, updatedSkill) => {
    const res = await api.put(`/skills/${id}`, updatedSkill);
    return res.data;
  }
};

export const leadService = {
  getLeads: async () => {
    const res = await api.get('/leads');
    return res.data;
  }
};

export const analyticsService = {
  getAnalytics: async () => {
    // The backend doesn't have an analytics endpoint yet, return mock for now so the UI doesn't crash
    return {
      views: 12450,
      uniqueVisitors: 8320,
      resumeDownloads: 340,
      activeLeads: 12,
      trafficData: [
        { name: 'Mon', visits: 400 },
        { name: 'Tue', visits: 300 },
        { name: 'Wed', visits: 550 },
        { name: 'Thu', visits: 450 },
        { name: 'Fri', visits: 700 },
        { name: 'Sat', visits: 600 },
        { name: 'Sun', visits: 800 },
      ],
      deviceData: [
        { name: 'Desktop', value: 65 },
        { name: 'Mobile', value: 35 },
      ]
    };
  }
};

export const resumeService = {
  getResume: async () => {
    const res = await api.get('/resume');
    return res.data;
  },
  uploadResume: async (resumeDto) => {
    const res = await api.put('/resume', resumeDto);
    return res.data;
  }
};

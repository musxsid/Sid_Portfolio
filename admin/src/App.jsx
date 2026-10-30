import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Analytics from './pages/Analytics';
import ContactLeads from './pages/ContactLeads';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Resume from './pages/Resume';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Analytics />} />
          <Route path="leads" element={<ContactLeads />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="skills" element={<Skills />} />
          <Route path="resume" element={<Resume />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

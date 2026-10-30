import { NavLink } from 'react-router-dom';
import keycloak from '../keycloak';
import { 
  LayoutDashboard, 
  Users, 
  FolderGit2, 
  Briefcase, 
  Code2, 
  FileText, 
  LogOut 
} from 'lucide-react';

export default function Sidebar() {

  const handleLogout = () => {
    keycloak.logout();
  };

  const navItems = [
    { name: 'Analytics', path: '/', icon: LayoutDashboard },
    { name: 'Contact Leads', path: '/leads', icon: Users },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Experience', path: '/experience', icon: Briefcase },
    { name: 'Skills', path: '/skills', icon: Code2 },
    { name: 'Resume', path: '/resume', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 text-card-foreground">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-sm text-muted-foreground">Sid's Portfolio</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

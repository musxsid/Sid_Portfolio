import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Eye, Users, Download, UserPlus } from 'lucide-react';
import { analyticsService } from '../services/dataService';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await analyticsService.getAnalytics();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Loading Analytics...</div>;
  }

  if (!data) return null;

  const kpis = [
    { title: 'Total Portfolio Views', value: data.views, icon: Eye },
    { title: 'Unique Visitors', value: data.uniqueVisitors, icon: Users },
    { title: 'Resume Downloads', value: data.resumeDownloads, icon: Download },
    { title: 'Active Leads', value: data.activeLeads, icon: UserPlus },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{kpi.title}</h3>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="tracking-tight text-lg font-medium mb-4">Traffic Last 7 Days</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trafficData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-popover)', borderColor: 'var(--color-border)', color: 'var(--color-popover-foreground)', borderRadius: '0.5rem' }} 
                />
                <Line type="monotone" dataKey="visits" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="tracking-tight text-lg font-medium mb-4">Traffic by Device</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.deviceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-popover)', borderColor: 'var(--color-border)', color: 'var(--color-popover-foreground)', borderRadius: '0.5rem' }} 
                  cursor={{ fill: 'var(--color-muted)' }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { leadService } from '../services/dataService';

export default function ContactLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getLeads();
        setLeads(data);
      } catch (error) {
        console.error('Failed to fetch leads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Contact Leads</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading leads...</div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b [&_tr]:border-border">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Message Preview</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-muted-foreground">No leads found.</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">{lead.timestamp}</td>
                      <td className="p-4 align-middle font-medium">{lead.name}</td>
                      <td className="p-4 align-middle">{lead.email}</td>
                      <td className="p-4 align-middle">{lead.contactNumber}</td>
                      <td className="p-4 align-middle max-w-[200px] truncate">{lead.message}</td>
                      <td className="p-4 align-middle">
                        <button
                          onClick={() => setSelectedMessage(lead.message)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-secondary hover:text-secondary-foreground h-9 px-3"
                        >
                          <Eye className="h-4 w-4 mr-2" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground rounded-lg border border-border shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none tracking-tight">Full Message</h3>
                <button onClick={() => setSelectedMessage(null)} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="whitespace-pre-wrap">{selectedMessage}</p>
            </div>
            <div className="flex items-center p-6 border-t border-border justify-end">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

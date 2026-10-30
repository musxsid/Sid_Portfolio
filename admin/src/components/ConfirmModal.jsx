import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isDestructive = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card text-card-foreground rounded-lg border border-border shadow-lg w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="flex flex-col p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isDestructive && (
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 flex-shrink-0 -mt-1">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-muted/20">
          <button 
            type="button" 
            onClick={onClose} 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 ${
              isDestructive 
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

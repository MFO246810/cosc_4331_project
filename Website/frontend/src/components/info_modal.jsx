export default function Info_Modal({ type = 'info', message, onClose }){
    const styles = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        error: "bg-red-50 border-red-200 text-red-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    };

    if (!message) return null;

    return (
        <div className={`flex items-center p-4 border rounded-lg ${styles[type]}`} role="alert">
            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
      
        <div className="ml-3 text-sm font-medium flex-1">
            {message}
        </div>

        {onClose && (
            <button 
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 flex items-center justify-center h-8 w-8 hover:bg-opacity-20 hover:bg-red-200 rounded-lg transition"
            >
            ✕
            </button>
        )}
        </div>
    );
};
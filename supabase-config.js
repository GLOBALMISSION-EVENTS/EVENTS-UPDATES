// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://yxrkpxehqzbaunznwqii.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtwcGVocXpiYXVuem53cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjM5OTMsImV4cCI6MjA1NDUzOTk5M30.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtwcGVocXpiYXVuem53cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjM5OTMsImV4cCI6MjA1NDUzOTk5M30'
};

// Initialize Supabase client
let supabase;

// Wait for Supabase library to load, then initialize
if (typeof window !== 'undefined') {
    // Check if supabase library is loaded
    const initSupabase = () => {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Supabase initialized successfully');
            return true;
        }
        return false;
    };

    // Try to initialize immediately
    if (!initSupabase()) {
        // If not loaded yet, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', initSupabase);
    }
}

// Export for use in other files
window.getSupabase = () => supabase;

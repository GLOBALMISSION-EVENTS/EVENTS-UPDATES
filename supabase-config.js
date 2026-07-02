// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://yxrkpxehqzbaunznwqii.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtwcGVocXpiYXVuem53cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjM5OTMsImV4cCI6MjA1NDUzOTk5M30.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtwcGVocXpiYXVuem53cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjM5OTMsImV4cCI6MjA1NDUzOTk5M30'
};

// Initialize Supabase client (will be loaded from CDN)
let supabase;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if Supabase library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded!');
        return;
    }
    
    // Create Supabase client
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    
    console.log('✅ Supabase initialized');
});

// Export for use in other files
window.getSupabase = () => supabase;

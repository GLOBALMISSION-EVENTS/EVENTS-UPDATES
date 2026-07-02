// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://yxrkpxehqzbaunznwqii.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtweGVocXpiYXVuem52cWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Mzc4MjEsImV4cCI6MjA5ODUxMzgyMX0.sWTVPDAwz1NG9IzRrWTLcD7a8eT3q5emg_oqkAiez48'
};

// Global Supabase client - will be initialized when library loads
window.supabaseClient = null;
window.supabaseReady = false;

// Initialize Supabase when the library is available
function initializeSupabase() {
    try {
        // Check if the Supabase library is loaded
        if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
            console.log('Waiting for Supabase library...');
            return false;
        }

        // Create the client
        window.supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url, 
            SUPABASE_CONFIG.anonKey
        );
        
        window.supabaseReady = true;
        console.log('✅ Supabase initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return false;
    }
}

// Helper function to get Supabase client
window.getSupabase = function() {
    return window.supabaseClient;
};

// Helper to wait for Supabase to be ready
window.waitForSupabase = async function(maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
        if (window.supabaseReady) {
            return true;
        }
        if (initializeSupabase()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
};

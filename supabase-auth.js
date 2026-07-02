// Supabase Authentication Module
// Handles all authentication operations

class SupabaseAuth {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
    }

    // Initialize
    async init() {
        this.supabase = window.getSupabase();
        
        if (!this.supabase) {
            console.error('Supabase not initialized!');
            return false;
        }

        // Check for existing session
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            return true;
        }
        
        return false;
    }

    // Login with email and password
    async login(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            this.currentUser = data.user;
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout
    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            callback(event, session);
        });
    }
}

// Export singleton instance
window.supabaseAuth = new SupabaseAuth();

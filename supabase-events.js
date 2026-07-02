// Supabase Events Module
// Handles all event CRUD operations with Supabase database

class SupabaseEvents {
    constructor() {
        this.supabase = null;
        this.events = [];
    }

    // Initialize
    init() {
        this.supabase = window.getSupabase();
        if (!this.supabase) {
            console.error('Supabase not initialized!');
            return false;
        }
        return true;
    }

    // Fetch all events
    async fetchAll() {
        try {
            const { data, error } = await this.supabase
                .from('events')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;

            this.events = data || [];
            return { success: true, events: this.events };
        } catch (error) {
            console.error('Fetch events error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get events by type (upcoming/recent)
    getByType(type) {
        return this.events.filter(e => e.type === type);
    }

    // Create new event
    async create(eventData) {
        try {
            const { data, error } = await this.supabase
                .from('events')
                .insert([{
                    title: eventData.title,
                    date: eventData.date,
                    venue: eventData.venue,
                    description: eventData.description,
                    type: eventData.type,
                    image: eventData.image || null,
                    display_order: eventData.display_order || this.events.length
                }])
                .select();

            if (error) throw error;

            // Add to local cache
            if (data && data.length > 0) {
                this.events.push(data[0]);
            }

            return { success: true, event: data[0] };
        } catch (error) {
            console.error('Create event error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update existing event
    async update(id, eventData) {
        try {
            const { data, error } = await this.supabase
                .from('events')
                .update({
                    title: eventData.title,
                    date: eventData.date,
                    venue: eventData.venue,
                    description: eventData.description,
                    type: eventData.type,
                    image: eventData.image || null,
                    display_order: eventData.display_order
                })
                .eq('id', id)
                .select();

            if (error) throw error;

            // Update local cache
            const index = this.events.findIndex(e => e.id === id);
            if (index !== -1 && data && data.length > 0) {
                this.events[index] = data[0];
            }

            return { success: true, event: data[0] };
        } catch (error) {
            console.error('Update event error:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete event
    async delete(id) {
        try {
            const { error } = await this.supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Remove from local cache
            this.events = this.events.filter(e => e.id !== id);

            return { success: true };
        } catch (error) {
            console.error('Delete event error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update display order for all events
    async updateOrder(orderedIds) {
        try {
            const updates = orderedIds.map((id, index) => ({
                id: id,
                display_order: index
            }));

            for (const update of updates) {
                const { error } = await this.supabase
                    .from('events')
                    .update({ display_order: update.display_order })
                    .eq('id', update.id);

                if (error) throw error;
            }

            // Refresh local cache
            await this.fetchAll();

            return { success: true };
        } catch (error) {
            console.error('Update order error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get single event by ID
    getById(id) {
        return this.events.find(e => e.id === id);
    }

    // Export events as JSON
    exportData() {
        return JSON.stringify(this.events, null, 2);
    }

    // Import events from JSON
    async importData(eventsArray) {
        try {
            // Delete all existing events
            const { error: deleteError } = await this.supabase
                .from('events')
                .delete()
                .neq('id', 0); // Delete all

            if (deleteError) throw deleteError;

            // Insert new events
            const { data, error } = await this.supabase
                .from('events')
                .insert(eventsArray.map(evt => ({
                    title: evt.title,
                    date: evt.date,
                    venue: evt.venue,
                    description: evt.description,
                    type: evt.type,
                    image: evt.image || null,
                    display_order: evt.display_order || 0
                })))
                .select();

            if (error) throw error;

            // Refresh local cache
            await this.fetchAll();

            return { success: true, events: data };
        } catch (error) {
            console.error('Import events error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export singleton instance
window.supabaseEvents = new SupabaseEvents();

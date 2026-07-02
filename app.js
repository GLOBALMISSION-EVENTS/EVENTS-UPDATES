const initialEvents = [
    {
        id: 1,
        title: "Mission Impact Breakfast",
        date: "10th July 2026 - 9AM",
        venue: "Y.M.C.A. Hall - Nyeri Town",
        description: "Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp. Breakfast will be served. Come Hungry - Leave Inspired. Blessed are those who hunger and thirst for righteousness, for they shall be filled. Mat 5:6 (NIV)",
        type: "upcoming",
        image: "images/breakfast-poster.png"
    },
    {
        id: 2,
        title: "5th Annual Mega Conference & Free Medical Camp",
        date: "9-16th August 2026 from 9AM",
        venue: "Kiamariga Nursery Grounds",
        description: "Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration. All Are Welcome! Featuring: Rev. Anthony Waithaka (Director - GMCI), Archbishop Simon Githigi (Elim Pentecostal Kenya), Bishop Moses Mbugua (Redeemed Gospel Church Thika), Apostle Anthony Ngumo (Reigners Chapel), Rev. James Nyaga (Excellent Glory Center), Bishop Dr. Margaret Wangare (Anointed Christian Fellowship Banana).",
        type: "upcoming",
        image: "images/about-us.png"
    },
    {
        id: 3,
        title: "Conference & Medical Camp @ Kiamariga",
        date: "9th -16 August 2026",
        venue: "Kiamariga",
        description: "Our 5th Annual Conference & Medical Camp",
        type: "upcoming",
        image: "images/kiamariga-camp.jpg"
    }
];

// Load events: Initialize from Supabase
let events = [];
let currentTab = 'upcoming';
let sortable = null;

let currentSlide = 0;
let slideInterval;

// Smooth scroll and touch optimizations
document.documentElement.style.scrollBehavior = 'smooth';

document.addEventListener('DOMContentLoaded', async function() {
    // Auto-update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Wait for Supabase to be ready
    let retries = 0;
    while (!window.getSupabase() && retries < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
    }
    
    if (!window.getSupabase()) {
        console.error('Failed to initialize Supabase');
        alert('Failed to connect to database. Please refresh the page.');
        return;
    }
    
    // Initialize Supabase modules
    await window.supabaseAuth.init();
    window.supabaseEvents.init();
    
    // Load events from Supabase
    const result = await window.supabaseEvents.fetchAll();
    if (result.success) {
        events = result.events;
    }
    
    // Check authentication status
    checkAuthStatus();
    
    // Initialize carousel
    initCarousel();
    
    renderEvents();
    initSortable();
    initEventListeners();
    initAuthListeners();
});

// Authentication functions
async function checkAuthStatus() {
    const isLoggedIn = window.supabaseAuth.isAuthenticated();
    if (isLoggedIn) {
        showCMS();
    } else {
        showLogin();
    }
}

function showCMS() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('cms').style.display = 'block';
    document.getElementById('adminNav').style.display = 'block';
    document.getElementById('qrNav').style.display = 'block';
    renderCMS();
}

function showLogin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('cms').style.display = 'none';
    document.getElementById('adminNav').style.display = 'none';
    document.getElementById('qrNav').style.display = 'none';
    document.getElementById('loginError').style.display = 'none';
}

async function login(email, password) {
    const result = await window.supabaseAuth.login(email, password);
    
    if (result.success) {
        showCMS();
        return true;
    } else {
        document.getElementById('loginError').textContent = result.error || 'Login failed. Please try again.';
        document.getElementById('loginError').style.display = 'block';
        return false;
    }
}

async function logout() {
    await window.supabaseAuth.logout();
    showLogin();
    location.reload();
}

function initAuthListeners() {
    // Login form submit
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        await login(email, password);
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Listen to auth state changes
    window.supabaseAuth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            showLogin();
        } else if (event === 'SIGNED_IN') {
            showCMS();
        }
    });
}

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Show first slide
    showSlide(0);
    
    // Auto-play
    startAutoPlay();
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pause on hover
    document.querySelector('.hero').addEventListener('mouseenter', stopAutoPlay);
    document.querySelector('.hero').addEventListener('mouseleave', startAutoPlay);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Wrap around
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    // Remove active from all
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active to current
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function startAutoPlay() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 12000); // Change slide every 12 seconds
}

function stopAutoPlay() {
    clearInterval(slideInterval);
}

function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    const filteredEvents = window.supabaseEvents.getByType(currentTab);
    
    grid.innerHTML = filteredEvents.map(event => `
        <div class="event-card">
            <div class="event-card-image">
                ${event.image 
                    ? `<img src="${event.image}" alt="${event.title}" class="event-card-img" loading="lazy">` 
                    : '✝️'}
            </div>
            <div class="event-card-content">
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-date">📅 ${event.date}</p>
                <p class="event-card-venue">📍 ${event.venue}</p>
                <p class="event-card-description">${event.description}</p>
            </div>
        </div>
    `).join('');
}

async function renderCMS() {
    const grid = document.getElementById('cmsGrid');
    const allEvents = window.supabaseEvents.events;
    
    grid.innerHTML = allEvents.map(event => `
        <div class="cms-card" data-id="${event.id}">
            <div class="cms-card-header">
                <div class="cms-card-title">${event.title}</div>
                <div class="cms-card-actions">
                    <button class="cms-card-btn edit" onclick="editEvent(${event.id})" title="Edit">✏️</button>
                    <button class="cms-card-btn delete" onclick="deleteEvent(${event.id})" title="Delete">🗑️</button>
                </div>
            </div>
            <p class="cms-card-date">${event.date}</p>
            <span class="cms-card-type ${event.type}">${event.type}</span>
        </div>
    `).join('');
    
    initSortable();
}

function initSortable() {
    const grid = document.getElementById('cmsGrid');
    if (sortable) {
        sortable.destroy();
    }
    sortable = new Sortable(grid, {
        animation: 150,
        ghostClass: 'dragging',
        onEnd: async function(evt) {
            // Get new order of IDs
            const orderedIds = Array.from(grid.children).map(card => 
                parseInt(card.getAttribute('data-id'))
            );
            
            // Update order in database
            await window.supabaseEvents.updateOrder(orderedIds);
            renderEvents();
        }
    });
}

function initEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.dataset.tab;
            renderEvents();
        });
    });
    
    document.getElementById('addEventBtn').addEventListener('click', () => openModal());
    
    document.getElementById('saveDataBtn').addEventListener('click', async () => {
        // Data is automatically saved to Supabase on each operation
        alert('All changes are automatically saved to the database!');
    });
    
    document.getElementById('exportDataBtn').addEventListener('click', async () => {
        const dataStr = window.supabaseEvents.exportData();
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gmci-events-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    });
    
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    
    document.getElementById('resetEventsBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset all events to default? This cannot be undone!')) {
            const result = await window.supabaseEvents.importData(initialEvents);
            if (result.success) {
                renderEvents();
                renderCMS();
                alert('Events reset to default successfully!');
            } else {
                alert('Error resetting events: ' + result.error);
            }
        }
    });
    
    document.getElementById('importFile').addEventListener('change', importData);
    
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // File upload listener with validation
    document.getElementById('eventImageFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const imagePreview = document.getElementById('imagePreview');
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images only.');
                e.target.value = '';
                return;
            }
            
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image is too large. Maximum size is 2MB. Please compress the image first.');
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                selectedImageData = event.target.result;
                imagePreview.innerHTML = `<img src="${selectedImageData}" style="max-height:100px; border-radius:8px;">`;
            };
            
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
                e.target.value = '';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('eventForm').addEventListener('submit', handleFormSubmit);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an internal anchor link (starts with #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
            
            // Close mobile menu regardless of link type
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navLinks = document.getElementById('navLinks');
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('eventModal')) {
            closeModal();
        }
        // Close mobile menu if clicking outside
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            const navLinksEl = document.getElementById('navLinks');
            const mobileMenuBtnEl = document.getElementById('mobileMenuBtn');
            if (navLinksEl && navLinksEl.classList.contains('active')) {
                navLinksEl.classList.remove('active');
                if (mobileMenuBtnEl) {
                    mobileMenuBtnEl.classList.remove('active');
                }
            }
        }
    });
}

let selectedImageData = null;

function openModal(event = null) {
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('eventForm');
    const imagePreview = document.getElementById('imagePreview');
    
    form.reset();
    imagePreview.innerHTML = '';
    selectedImageData = null;
    
    if (event) {
        modalTitle.textContent = 'Edit Event';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventVenue').value = event.venue;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventImage').value = event.image;
        if (event.image) {
            imagePreview.innerHTML = `<img src="${event.image}" style="max-height:100px; border-radius:8px;">`;
        }
    } else {
        modalTitle.textContent = 'Add New Event';
        document.getElementById('eventId').value = '';
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('eventModal').classList.remove('active');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('eventId').value;
    
    // Validate and sanitize inputs
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value.trim();
    const venue = document.getElementById('eventVenue').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const type = document.getElementById('eventType').value;
    const image = selectedImageData || document.getElementById('eventImage').value.trim();
    
    // Validation
    if (!title || !date || !venue || !description) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (title.length > 200) {
        alert('Event title is too long (max 200 characters).');
        return;
    }
    
    if (description.length > 5000) {
        alert('Event description is too long (max 5000 characters).');
        return;
    }
    
    const eventData = {
        title,
        date,
        venue,
        description,
        type,
        image
    };
    
    let result;
    if (id) {
        // Update existing event
        result = await window.supabaseEvents.update(parseInt(id), eventData);
    } else {
        // Create new event
        result = await window.supabaseEvents.create(eventData);
    }
    
    if (result.success) {
        await window.supabaseEvents.fetchAll(); // Refresh
        renderEvents();
        renderCMS();
        closeModal();
    } else {
        alert('Error saving event: ' + result.error);
    }
}

async function editEvent(id) {
    const event = window.supabaseEvents.getById(id);
    if (event) {
        openModal(event);
    }
}

async function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        const result = await window.supabaseEvents.delete(id);
        if (result.success) {
            renderEvents();
            renderCMS();
        } else {
            alert('Error deleting event: ' + result.error);
        }
    }
}

// Removed saveToStorage() - now using Supabase database
// Removed exportData() - now using window.supabaseEvents.exportData()

async function importData(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Maximum size is 5MB.');
            return;
        }
        
        // Validate file type
        if (!file.type.includes('json')) {
            alert('Invalid file type. Please select a JSON file.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async function(event) {
            try {
                const importedEvents = JSON.parse(event.target.result);
                
                // Validate structure
                if (!Array.isArray(importedEvents)) {
                    throw new Error('Invalid data format: expected an array');
                }
                
                // Import to Supabase
                const result = await window.supabaseEvents.importData(importedEvents);
                
                if (result.success) {
                    renderEvents();
                    renderCMS();
                    alert('Data imported successfully!');
                } else {
                    alert('Error importing data: ' + result.error);
                }
            } catch (err) {
                alert('Invalid JSON file: ' + err.message);
                console.error('Import error:', err);
            }
        };
        
        reader.onerror = function() {
            alert('Error reading file.');
        };
        
        reader.readAsText(file);
    }
}

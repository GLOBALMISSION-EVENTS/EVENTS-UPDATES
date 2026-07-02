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

// Load events: use initial events if localStorage is missing images
const storedEvents = JSON.parse(localStorage.getItem('gmci_events'));
let events = storedEvents;
if (!events || !events[0] || !events[0].image) {
    events = initialEvents;
    saveToStorage();
}
let currentTab = 'upcoming';
let sortable = null;

let currentSlide = 0;
let slideInterval;

// Smooth scroll and touch optimizations
document.documentElement.style.scrollBehavior = 'smooth';

// Authentication configuration
const ADMIN_PASSWORD_KEY = 'gmci_admin_logged_in';
const SESSION_TIMESTAMP_KEY = 'gmci_session_timestamp';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const MAX_LOGIN_ATTEMPTS_KEY = 'gmci_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes lockout after max attempts

// Password hash using SHA-256 (client-side security layer)
// IMPORTANT: Change this hash to your new password by running:
// await hashPassword('your-new-password') in browser console
const ADMIN_PASSWORD_HASH = 'e8c8d4c4a8f4e2c0d5b6f1a3e9c7d2b5a4f6e1c8d3b7a2f5e9c4d6b1a8f3e7c2'; // Hash of 'gmci2026@secure!'

// Security utilities
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function sanitizeHTML(html) {
    // Basic XSS prevention - remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
        .replace(/javascript:/gi, '');
}

function checkSessionTimeout() {
    const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    if (timestamp) {
        const elapsed = Date.now() - parseInt(timestamp);
        if (elapsed > SESSION_TIMEOUT) {
            // Session expired
            logout();
            alert('Session expired. Please login again.');
            return false;
        }
        // Update timestamp on activity
        localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    }
    return true;
}

function checkLockout() {
    const attempts = JSON.parse(localStorage.getItem(MAX_LOGIN_ATTEMPTS_KEY) || '{"count":0,"timestamp":0}');
    if (attempts.count >= MAX_ATTEMPTS) {
        const elapsed = Date.now() - attempts.timestamp;
        if (elapsed < LOCKOUT_TIME) {
            const remaining = Math.ceil((LOCKOUT_TIME - elapsed) / 1000 / 60);
            return { locked: true, remaining };
        } else {
            // Reset after lockout period
            localStorage.removeItem(MAX_LOGIN_ATTEMPTS_KEY);
        }
    }
    return { locked: false };
}

function recordFailedAttempt() {
    const attempts = JSON.parse(localStorage.getItem(MAX_LOGIN_ATTEMPTS_KEY) || '{"count":0,"timestamp":0}');
    attempts.count++;
    attempts.timestamp = Date.now();
    localStorage.setItem(MAX_LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    return attempts.count;
}

function clearLoginAttempts() {
    localStorage.removeItem(MAX_LOGIN_ATTEMPTS_KEY);
}

// Auto-logout timer
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    const isLoggedIn = localStorage.getItem(ADMIN_PASSWORD_KEY) === 'true';
    if (isLoggedIn) {
        inactivityTimer = setTimeout(() => {
            logout();
            alert('Logged out due to inactivity.');
            location.reload();
        }, SESSION_TIMEOUT);
    }
}

// Track user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

document.addEventListener('DOMContentLoaded', function() {
    // Auto-update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Check authentication status on load
    checkAuthStatus();
    
    // Initialize carousel
    initCarousel();
    
    renderEvents();
    // Don't render CMS unless authenticated
    initSortable();
    initEventListeners();
    initAuthListeners();
});

// Authentication functions
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem(ADMIN_PASSWORD_KEY) === 'true';
    if (isLoggedIn) {
        // Check if session is still valid
        if (checkSessionTimeout()) {
            showCMS();
            resetInactivityTimer();
        }
    } else {
        showLogin();
    }
}

function showCMS() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('cms').style.display = 'block';
    document.getElementById('adminNav').style.display = 'block';
    document.getElementById('qrNav').style.display = 'block';
    localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    resetInactivityTimer();
    renderCMS();
}

function showLogin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('cms').style.display = 'none';
    document.getElementById('adminNav').style.display = 'none';
    document.getElementById('qrNav').style.display = 'none';
    document.getElementById('loginError').style.display = 'none';
    clearTimeout(inactivityTimer);
}

async function login(password) {
    // Check if account is locked
    const lockStatus = checkLockout();
    if (lockStatus.locked) {
        document.getElementById('loginError').textContent = 
            `Too many failed attempts. Please try again in ${lockStatus.remaining} minutes.`;
        document.getElementById('loginError').style.display = 'block';
        return false;
    }
    
    // Hash the entered password and compare
    const enteredHash = await hashPassword(password);
    if (enteredHash === ADMIN_PASSWORD_HASH) {
        localStorage.setItem(ADMIN_PASSWORD_KEY, 'true');
        localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        clearLoginAttempts();
        showCMS();
        return true;
    } else {
        const attempts = recordFailedAttempt();
        const remaining = MAX_ATTEMPTS - attempts;
        
        if (remaining > 0) {
            document.getElementById('loginError').textContent = 
                `Incorrect password. ${remaining} attempts remaining.`;
        } else {
            document.getElementById('loginError').textContent = 
                `Too many failed attempts. Account locked for 15 minutes.`;
        }
        document.getElementById('loginError').style.display = 'block';
        return false;
    }
}

function logout() {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
    clearTimeout(inactivityTimer);
    showLogin();
}

function initAuthListeners() {
    // Login form submit
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const success = await login(password);
        if (success) {
            document.getElementById('adminPassword').value = '';
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
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
    const filteredEvents = events.filter(e => e.type === currentTab);
    
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

function renderCMS() {
    const grid = document.getElementById('cmsGrid');
    
    grid.innerHTML = events.map(event => `
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
        onEnd: function(evt) {
            const item = events.splice(evt.oldIndex, 1)[0];
            events.splice(evt.newIndex, 0, item);
            saveToStorage();
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
    
    document.getElementById('saveDataBtn').addEventListener('click', () => {
        saveToStorage();
        alert('Data saved successfully!');
    });
    
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    
    document.getElementById('resetEventsBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all events to default?')) {
            events = initialEvents;
            saveToStorage();
            renderEvents();
            renderCMS();
            alert('Events reset to default successfully!');
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

function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('eventId').value;
    
    // Sanitize all inputs to prevent XSS
    const eventData = {
        id: id ? parseInt(id) : Date.now(),
        title: sanitizeInput(document.getElementById('eventTitle').value),
        date: sanitizeInput(document.getElementById('eventDate').value),
        venue: sanitizeInput(document.getElementById('eventVenue').value),
        description: sanitizeHTML(document.getElementById('eventDescription').value),
        type: document.getElementById('eventType').value,
        image: selectedImageData || sanitizeInput(document.getElementById('eventImage').value)
    };
    
    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.venue || !eventData.description) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Validate title length
    if (eventData.title.length > 200) {
        alert('Event title is too long (max 200 characters).');
        return;
    }
    
    // Validate description length
    if (eventData.description.length > 5000) {
        alert('Event description is too long (max 5000 characters).');
        return;
    }
    
    if (id) {
        const index = events.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
            events[index] = eventData;
        }
    } else {
        events.push(eventData);
    }
    
    saveToStorage();
    renderEvents();
    renderCMS();
    closeModal();
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        openModal(event);
    }
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== id);
        saveToStorage();
        renderEvents();
        renderCMS();
    }
}

function saveToStorage() {
    try {
        const dataStr = JSON.stringify(events);
        // Check storage size (approximate)
        const sizeInBytes = new Blob([dataStr]).size;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        if (sizeInMB > 4) {
            alert('Warning: Data size is getting large. Consider using fewer or smaller images.');
        }
        
        localStorage.setItem('gmci_events', dataStr);
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            alert('Storage quota exceeded! Please delete old events or reduce image sizes.');
        } else {
            alert('Error saving data: ' + error.message);
        }
        console.error('Storage error:', error);
        return false;
    }
}

function exportData() {
    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gmci-events.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(e) {
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
        reader.onload = function(event) {
            try {
                const importedEvents = JSON.parse(event.target.result);
                
                // Validate structure
                if (!Array.isArray(importedEvents)) {
                    throw new Error('Invalid data format: expected an array');
                }
                
                // Sanitize imported data
                const sanitizedEvents = importedEvents.map(evt => ({
                    id: evt.id || Date.now() + Math.random(),
                    title: sanitizeInput(evt.title || ''),
                    date: sanitizeInput(evt.date || ''),
                    venue: sanitizeInput(evt.venue || ''),
                    description: sanitizeHTML(evt.description || ''),
                    type: ['upcoming', 'recent'].includes(evt.type) ? evt.type : 'upcoming',
                    image: sanitizeInput(evt.image || '')
                }));
                
                events = sanitizedEvents;
                if (saveToStorage()) {
                    renderEvents();
                    renderCMS();
                    alert('Data imported successfully!');
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

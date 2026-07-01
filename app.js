const initialEvents = [
    {
        id: 1,
        title: "Mission Impact Breakfast",
        date: "10th July 2026 - 9AM",
        venue: "Y.M.C.A. Hall - Nyeri Town",
        description: "Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp. Breakfast will be served. Come Hungry - Leave Inspired. Blessed are those who hunger and thirst for righteousness, for they shall be filled. Mat 5:6 (NIV)",
        type: "upcoming",
        image: "images/breakfast-poster.jpg"
    },
    {
        id: 2,
        title: "5th Annual Mega Conference & Free Medical Camp",
        date: "9-16th August 2026 from 9AM",
        venue: "Kiamariga Nursery Grounds",
        description: "Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration. All Are Welcome! Featuring: Rev. Anthony Waithaka (Director - GMCI), Archbishop Simon Githigi (Elim Pentecostal Kenya), Bishop Moses Mbugua (Redeemed Gospel Church Thika), Apostle Anthony Ngumo (Reigners Chapel), Rev. James Nyaga (Excellent Glory Center), Bishop Dr. Margaret Wangare (Anointed Christian Fellowship Banana).",
        type: "upcoming",
        image: "images/conference-poster.jpg"
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

document.addEventListener('DOMContentLoaded', function() {
    renderEvents();
    renderCMS();
    initSortable();
    initEventListeners();
});

function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    const filteredEvents = events.filter(e => e.type === currentTab);
    
    grid.innerHTML = filteredEvents.map(event => `
        <div class="event-card">
            <div class="event-card-image" style="${event.image ? `background: url('${event.image}') center/cover;` : ''}">
                ${!event.image ? '✝️' : ''}
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
    
    document.getElementById('eventForm').addEventListener('submit', handleFormSubmit);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('eventModal')) {
            closeModal();
        }
    });
}

function openModal(event = null) {
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('eventForm');
    
    form.reset();
    
    if (event) {
        modalTitle.textContent = 'Edit Event';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventVenue').value = event.venue;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventImage').value = event.image;
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
    const eventData = {
        id: id ? parseInt(id) : Date.now(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        venue: document.getElementById('eventVenue').value,
        description: document.getElementById('eventDescription').value,
        type: document.getElementById('eventType').value,
        image: document.getElementById('eventImage').value
    };
    
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
    localStorage.setItem('gmci_events', JSON.stringify(events));
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
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedEvents = JSON.parse(event.target.result);
                if (Array.isArray(importedEvents)) {
                    events = importedEvents;
                    saveToStorage();
                    renderEvents();
                    renderCMS();
                    alert('Data imported successfully!');
                }
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }
}

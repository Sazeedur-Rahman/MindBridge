{// Main JavaScript file for MindBridge platform

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm(this);
        });
    });

    // Initialize animations
    initializeAnimations();
    
    // Initialize mental health tracking
    initializeMentalHealthTracking();
});

// Form validation function
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    if (isValid) {
        // Show success message
        showSuccessMessage('Form submitted successfully! We\'ll get back to you soon.');
        form.reset();
    }
}

function showFieldError(input, message) {
    clearFieldError(input);
    input.style.borderColor = '#dc3545';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .stat, .about-stat');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Mental health tracking utilities
function initializeMentalHealthTracking() {
    // Check if user has stored mental health data
    const mentalHealthData = getMentalHealthData();
    
    // Initialize mood tracking if on appropriate pages
    if (document.getElementById('moodGrid')) {
        initializeMoodTracking();
    }
    
    // Initialize habit tracking if on appropriate pages
    if (document.getElementById('todayHabits')) {
        initializeHabitTracking();
    }
}

function getMentalHealthData() {
    return {
        moods: JSON.parse(localStorage.getItem('moodHistory') || '[]'),
        habits: JSON.parse(localStorage.getItem('habitHistory') || '[]'),
        sessions: JSON.parse(localStorage.getItem('sessionHistory') || '[]'),
        preferences: JSON.parse(localStorage.getItem('userPreferences') || '{}')
    };
}

function saveMentalHealthData(type, data) {
    const currentData = getMentalHealthData();
    currentData[type] = data;
    localStorage.setItem(type + 'History', JSON.stringify(data));
}

// Mood tracking functions
function initializeMoodTracking() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.dataset.mood;
            const emoji = this.textContent;
            logMoodEntry(mood, emoji);
        });
    });
}

function logMoodEntry(mood, emoji) {
    const moodEntry = {
        mood: mood,
        emoji: emoji,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };
    
    const moodHistory = getMentalHealthData().moods;
    moodHistory.push(moodEntry);
    saveMentalHealthData('moods', moodHistory);
    
    // Provide user feedback
    showMoodFeedback(mood, emoji);
}

function showMoodFeedback(mood, emoji) {
    const feedbackMessages = {
        'very-happy': 'That\'s wonderful! Your positive mood is great for your overall well-being. 🌟',
        'happy': 'Great to hear you\'re feeling good! Keep up the positive momentum! 😊',
        'neutral': 'It\'s okay to have neutral days. Consider doing something you enjoy today. 💙',
        'sad': 'I understand you\'re feeling down. Remember, it\'s okay to feel this way sometimes. Consider reaching out for support. 💚',
        'very-sad': 'I\'m concerned about how you\'re feeling. Please consider talking to someone or using our crisis resources. ❤️'
    };
    
    const message = feedbackMessages[mood] || 'Thank you for logging your mood.';
    showNotification(message, mood.includes('sad') ? 'warning' : 'success');
}

// Habit tracking functions
function initializeHabitTracking() {
    // This would be expanded based on the habit tracking implementation
    console.log('Habit tracking initialized');
    }
    function removeHabit(id) {
        // Remove the habit from your habits array
        habits = habits.filter(habit => habit.id !== id);
        // Re-render your habits list in DOM
        renderHabits();
    }


// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 350px;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        background: ${getNotificationColor(type)};
        color: white;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Crisis detection and intervention
function detectCrisisKeywords(text) {
    const crisisKeywords = [
        'suicide', 'kill myself', 'end it all', 'not worth living',
        'want to die', 'better off dead', 'can\'t go on'
    ];
    
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
}

function triggerCrisisIntervention() {
    const crisisModal = document.createElement('div');
    crisisModal.className = 'crisis-modal';
    crisisModal.innerHTML = `
        <div class="crisis-modal-content">
            <h3><i class="fas fa-exclamation-triangle"></i> Immediate Support Available</h3>
            <p>I'm concerned about what you've shared. Your life has value and help is available.</p>
            <div class="crisis-contacts">
                <h4>Get Help Now:</h4>
                <ul>
                    <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong>Campus Emergency:</strong> Contact your university counseling center</li>
                </ul>
            </div>
            <div class="crisis-actions">
                <button onclick="window.open('tel:988')" class="crisis-btn primary">
                    <i class="fas fa-phone"></i> Call 988 Now
                </button>
                <button onclick="this.closest('.crisis-modal').remove()" class="crisis-btn secondary">
                    I'm Safe
                </button>
            </div>
        </div>
    `;
    
    crisisModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    document.body.appendChild(crisisModal);
}

// Accessibility features
function initializeAccessibility() {
    // High contrast mode toggle
    const highContrastToggle = document.createElement('button');
    highContrastToggle.innerHTML = '<i class="fas fa-adjust"></i>';
    highContrastToggle.className = 'accessibility-toggle';
    highContrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    highContrastToggle.onclick = toggleHighContrast;
    
    // Add to page if accessibility features are enabled
    if (localStorage.getItem('accessibilityEnabled') === 'true') {
        document.body.appendChild(highContrastToggle);
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
}

// Emergency contact integration
function setupEmergencyContacts() {
    const emergencyButtons = document.querySelectorAll('.emergency-contact');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const contactType = this.dataset.contact;
            
            if (contactType === 'call') {
                const phone = this.dataset.phone;
                if (confirm(`Call ${phone}?`)) {
                    window.open(`tel:${phone}`);
                }
            } else if (contactType === 'text') {
                const number = this.dataset.number;
                const message = this.dataset.message || 'HOME';
                window.open(`sms:${number}?body=${encodeURIComponent(message)}`);
            }
        });
    });
}

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Data privacy and security
function anonymizeUserData(data) {
    // Remove personally identifiable information
    const anonymized = { ...data };
    delete anonymized.name;
    delete anonymized.email;
    delete anonymized.phone;
    
    // Hash any remaining identifiers
    if (anonymized.userId) {
        anonymized.userId = btoa(anonymized.userId).substring(0, 8);
    }
    
    return anonymized;
}

// Export functions for use in other files
window.MindBridge = {
    showNotification,
    detectCrisisKeywords,
    triggerCrisisIntervention,
    logMoodEntry,
    getMentalHealthData,
    saveMentalHealthData
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .high-contrast {
        filter: contrast(1.5) brightness(1.2);
    }
    
    .accessibility-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #667eea;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
    }
    
    .crisis-modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        text-align: center;
    }
    
    .crisis-modal-content h3 {
        color: #dc3545;
        margin-bottom: 20px;
    }
    
    .crisis-contacts {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: left;
    }
    
    .crisis-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }
    
    .crisis-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .crisis-btn.primary {
        background: #dc3545;
        color: white;
    }
    
    .crisis-btn.secondary {
        background: #6c757d;
        color: white;
    }
    
    .crisis-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        opacity: 0.8;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255,255,255,0.2);
    }
`;

document.head.appendChild(style);
}

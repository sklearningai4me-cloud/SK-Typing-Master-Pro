// TypeMaster Pro - Main Application
console.log("TypeMaster Pro loaded!");

// ====================
// GLOBAL VARIABLES
// ====================
let currentLesson = 0;
let startTime = null;
let timerInterval = null;
let totalTime = 60; // seconds
let remainingTime = totalTime;
let isPlaying = false;
let errors = 0;
let totalTyped = 0;
let correctTyped = 0;

// ====================
// LESSONS DATA
// ====================
const lessons = [
    {
        id: 1,
        title: "Home Row Basics",
        text: "asdf jkl; asdf jkl; asdf jkl;",
        difficulty: "beginner",
        targetWPM: 20,
        timeLimit: 60
    },
    {
        id: 2,
        title: "Common Words",
        text: "the and you that for with have this from they",
        difficulty: "beginner",
        targetWPM: 25,
        timeLimit: 60
    },
    {
        id: 3,
        title: "Simple Sentences",
        text: "The cat sat on the mat. She has a red pen. We go to the park.",
        difficulty: "intermediate",
        targetWPM: 30,
        timeLimit: 90
    },
    {
        id: 4,
        title: "Programming Terms",
        text: "function variable const let return import export async await",
        difficulty: "advanced",
        targetWPM: 35,
        timeLimit: 120
    }
];

// ====================
// DOM ELEMENTS
// ====================
const typingInput = document.getElementById('typing-input');
const textDisplay = document.getElementById('text-display');
const currentWPM = document.getElementById('current-wpm');
const currentAccuracy = document.getElementById('current-accuracy');
const currentTime = document.getElementById('current-time');
const currentErrors = document.getElementById('current-errors');
const timerDisplay = document.getElementById('timer');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const lessonTitle = document.getElementById('lesson-title');

// ====================
// CORE FUNCTIONS
// ====================

// Initialize the app
function initApp() {
    console.log("Initializing TypeMaster Pro...");
    
    // Load first lesson
    loadLesson(currentLesson);
    
    // Set up event listeners
    setupEventListeners();
    
    // Update display
    updateStats();
    
    console.log("App ready!");
}

// Load a lesson by index
function loadLesson(index) {
    if (index < 0 || index >= lessons.length) {
        console.error("Invalid lesson index:", index);
        return;
    }
    
    const lesson = lessons[index];
    currentLesson = index;
    
    // Update UI
    lessonTitle.textContent = `Lesson ${index + 1}: ${lesson.title}`;
    textDisplay.textContent = lesson.text;
    typingInput.value = '';
    
    // Reset stats
    resetStats();
    remainingTime = lesson.timeLimit;
    updateTimerDisplay();
    
    // Update difficulty indicator
    updateDifficultyBadge(lesson.difficulty);
    
    console.log(`Loaded lesson: ${lesson.title}`);
}

// Reset all statistics
function resetStats() {
    startTime = null;
    errors = 0;
    totalTyped = 0;
    correctTyped = 0;
    isPlaying = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    updateStats();
}

// Update all statistics display
function updateStats() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    currentWPM.textContent = wpm;
    currentAccuracy.textContent = `${accuracy}%`;
    currentErrors.textContent = errors;
    
    // Update progress
    updateProgress();
}

// Calculate Words Per Minute
function calculateWPM() {
    if (!startTime || totalTyped === 0) return 0;
    
    const timeElapsed = (Date.now() - startTime) / 60000; // minutes
    const words = typingInput.value.trim().split(/\s+/).length;
    
    // Prevent infinite WPM at start
    if (timeElapsed < 0.1) return 0;
    
    return Math.floor(words / timeElapsed);
}

// Calculate typing accuracy
function calculateAccuracy() {
    if (totalTyped === 0) return 100;
    
    const accuracy = (correctTyped / totalTyped) * 100;
    return Math.min(100, Math.round(accuracy));
}

// Update progress bar
function updateProgress() {
    const typedLength = typingInput.value.length;
    const totalLength = lessons[currentLesson].text.length;
    const percentage = Math.min(100, (typedLength / totalLength * 100));
    
    progressFill.style.width = percentage + '%';
    progressPercent.textContent = `${Math.round(percentage)}%`;
    
    // Check if lesson is complete
    if (typedLength === totalLength && typingInput.value === lessons[currentLesson].text) {
        completeLesson();
    }
}

// Start the practice timer
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timeUp();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update difficulty badge
function updateDifficultyBadge(difficulty) {
    // Remove existing badges
    const badges = document.querySelectorAll('.difficulty-badge');
    badges.forEach(badge => badge.remove());
    
    // Create new badge
    const badge = document.createElement('span');
    badge.className = `difficulty-badge difficulty-${difficulty}`;
    badge.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    // Add to lesson title
    lessonTitle.appendChild(badge);
}

// Handle lesson completion
function completeLesson() {
    clearInterval(timerInterval);
    isPlaying = false;
    
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    alert(`🎉 Lesson Complete!\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nErrors: ${errors}`);
    
    // Auto-advance to next lesson after 2 seconds
    setTimeout(() => {
        nextLesson();
    }, 2000);
}

// Handle time up
function timeUp() {
    isPlaying = false;
    typingInput.disabled = true;
    
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    alert(`⏰ Time's Up!\nFinal WPM: ${wpm}\nAccuracy: ${accuracy}%\nErrors: ${errors}`);
}

// ====================
// CONTROL FUNCTIONS
// ====================

// Start practice session
function startPractice() {
    if (isPlaying) return;
    
    isPlaying = true;
    startTime = Date.now();
    typingInput.disabled = false;
    typingInput.focus();
    
    startTimer();
    console.log("Practice started");
}

// Pause practice
function pausePractice() {
    isPlaying = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    console.log("Practice paused");
}

// Reset current lesson
function resetPractice() {
    resetStats();
    typingInput.value = '';
    remainingTime = lessons[currentLesson].timeLimit;
    updateTimerDisplay();
    typingInput.disabled = false;
    typingInput.focus();
    console.log("Practice reset");
}

// Go to next lesson
function nextLesson() {
    currentLesson = (currentLesson + 1) % lessons.length;
    loadLesson(currentLesson);
    startPractice();
    console.log("Next lesson loaded");
}

// Go to previous lesson
function previousLesson() {
    currentLesson = (currentLesson - 1 + lessons.length) % lessons.length;
    loadLesson(currentLesson);
    startPractice();
    console.log("Previous lesson loaded");
}

// ====================
// EVENT LISTENERS
// ====================

function setupEventListeners() {
    // Typing input listener
    typingInput.addEventListener('input', (e) => {
        if (!isPlaying && e.target.value.length > 0) {
            startPractice();
        }
        
        const typedChar = e.target.value.slice(-1);
        const targetChar = lessons[currentLesson].text[e.target.value.length - 1];
        
        totalTyped++;
        
        if (typedChar === targetChar) {
            correctTyped++;
            // Visual feedback for correct key
            typingInput.style.borderColor = '#4CAF50';
        } else {
            errors++;
            // Visual feedback for incorrect key
            typingInput.style.borderColor = '#f44336';
            // Shake animation
            typingInput.classList.add('shake');
            setTimeout(() => typingInput.classList.remove('shake'), 300);
        }
        
        // Update stats
        updateStats();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + R to reset
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            resetPractice();
        }
        
        // Ctrl + N for next lesson
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            nextLesson();
        }
        
        // Ctrl + P for previous lesson
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            previousLesson();
        }
        
        // Escape to pause
        if (e.key === 'Escape') {
            pausePractice();
        }
    });
    
    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.3s;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .difficulty-badge {
            display: inline-block;
            margin-left: 10px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        .difficulty-beginner {
            background: #d4edda;
            color: #155724;
        }
        .difficulty-intermediate {
            background: #fff3cd;
            color: #856404;
        }
        .difficulty-advanced {
            background: #f8d7da;
            color: #721c24;
        }
    `;
    document.head.appendChild(style);
}

// ====================
// INITIALIZE APP
// ====================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for global access (for testing in console)
window.TypeMaster = {
    startPractice,
    pausePractice,
    resetPractice,
    nextLesson,
    previousLesson,
    loadLesson,
    getCurrentLesson: () => lessons[currentLesson],
    getStats: () => ({
        wpm: calculateWPM(),
        accuracy: calculateAccuracy(),
        errors,
        timeRemaining: remainingTime
    })
};
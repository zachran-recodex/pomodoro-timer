// File: renderer.js
const timerDisplay = document.getElementById('timer');
const sessionLabel = document.getElementById('session-label');
const cycleCount = document.getElementById('cycle-count');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Input fields
const focusTimeInput = document.getElementById('focus-time');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');
const cyclesInput = document.getElementById('cycles');

// Timer states
let timer;
let timeLeft;
let isRunning = false;
let isPaused = false;
let currentSession = 'focus'; // 'focus', 'shortBreak', 'longBreak'
let currentCycle = 1;
let totalCycles = 4;

// Initialize settings
function updateSettings() {
    totalCycles = parseInt(cyclesInput.value);
    updateCycleDisplay();
    resetTimer();
}

// Initialize the timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;

    // Reset UI state
    startBtn.disabled = false;
    pauseBtn.disabled = true;

    // Set current session to focus
    currentSession = 'focus';
    currentCycle = 1;
    updateSessionDisplay();

    // Reset time based on settings
    timeLeft = parseInt(focusTimeInput.value) * 60;
    updateTimerDisplay();
}

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Update session name display
function updateSessionDisplay() {
    switch(currentSession) {
        case 'focus':
            sessionLabel.textContent = 'Fokus';
            sessionLabel.className = 'px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm font-medium';
            break;
        case 'shortBreak':
            sessionLabel.textContent = 'Istirahat Pendek';
            sessionLabel.className = 'px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium';
            break;
        case 'longBreak':
            sessionLabel.textContent = 'Istirahat Panjang';
            sessionLabel.className = 'px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium';
            break;
    }

    updateCycleDisplay();
}

// Update cycle display
function updateCycleDisplay() {
    cycleCount.textContent = `${currentCycle}/${totalCycles}`;
}

// Start the timer
function startTimer() {
    if (isRunning && !isPaused) return;

    if (isPaused) {
        isPaused = false;
    } else {
        isRunning = true;
    }

    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            // Session complete
            clearInterval(timer);
            playAlarm();
            switchSession();
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    if (!isRunning) return;

    clearInterval(timer);
    isPaused = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Switch to the next session
function switchSession() {
    if (currentSession === 'focus') {
        // After focus session, determine if it should be a short or long break
        if (currentCycle < totalCycles) {
            currentSession = 'shortBreak';
            timeLeft = parseInt(shortBreakInput.value) * 60;
            window.electron.notify('Waktu istirahat pendek!');
        } else {
            currentSession = 'longBreak';
            timeLeft = parseInt(longBreakInput.value) * 60;
            window.electron.notify('Waktu istirahat panjang!');
        }
    } else {
        // After any break, start a new focus session
        currentSession = 'focus';
        timeLeft = parseInt(focusTimeInput.value) * 60;
        window.electron.notify('Waktu fokus!');

        // If coming from a short break, increment the cycle
        if (currentSession === 'shortBreak') {
            currentCycle++;
        } else if (currentSession === 'longBreak') {
            // If coming from a long break, reset to cycle 1
            currentCycle = 1;
        }
    }

    updateSessionDisplay();
    updateTimerDisplay();

    // Auto-start the next session
    startTimer();
}

// Play an alarm sound
function playAlarm() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/956/956-preview.mp3');
    audio.play();
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Settings event listeners
focusTimeInput.addEventListener('change', updateSettings);
shortBreakInput.addEventListener('change', updateSettings);
longBreakInput.addEventListener('change', updateSettings);
cyclesInput.addEventListener('change', updateSettings);

// Initialize on load
updateSettings();
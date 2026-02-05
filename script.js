const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const questionContent = document.getElementById('question-content');
const successContent = document.getElementById('success-content');
const toastContainer = document.getElementById('toast-container');
const bgContainer = document.getElementById('background-effects');

let noCount = 0;
const messages = [
    "No? Are you sure? 🥺",
    "Think about the snacks! 🍕",
    "I'll give you back rubs...",
    "Don't break my heart! 💔",
    "I'll do the dishes! 🍽️",
    "Pretty please? 🍒",
    "You're my favorite person!",
    "I promise not to snore (much)",
    "We'll get a dog! 🐶",
    "Or a cat? 🐱",
    "Just click Yes already! 😆"
];

// --- Background Effects ---
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 5 + 10 + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.1;

    // Random size
    const size = Math.random() * 0.5 + 0.5;
    heart.style.transform = `scale(${size}) rotate(45deg)`;

    bgContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 15000);
}

// Create hearts periodically
setInterval(createHeart, 500);


// --- Interaction Logic ---

// Teleport "No" button
function moveNoButton() {
    // Generate new toast
    showToast(messages[noCount % messages.length]);
    noCount++;

    // Scale up "Yes" button slightly to encourage clicking it
    const currentScale = 1 + (noCount * 0.05);
    yesBtn.style.transform = `scale(${Math.min(currentScale, 1.5)})`;

    // Calculate random position
    // We want it to stay within reasonable bounds of the screen, but maybe not the ENTIRE screen to avoid header covering it
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Safe padding
    const padding = 20;

    const maxX = viewportWidth - btnWidth - padding;
    const maxY = viewportHeight - btnHeight - padding;

    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    // Move to body to prevent containing block issues with backdrop-filter
    if (noBtn.parentElement !== document.body) {
        document.body.appendChild(noBtn);
    }

    noBtn.style.position = 'fixed'; // Switch to fixed positioning
    noBtn.style.zIndex = '50'; // Ensure it's on top
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // Reset transform used for centering initially
    noBtn.style.transform = 'none';
}

// Events for "No" button
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent click
    moveNoButton();
});
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});


// Notification Toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bg-white/90 backdrop-blur text-rose-600 px-6 py-3 rounded-full shadow-xl font-semibold border-2 border-rose-100 toast-enter';
    toast.innerText = message;

    toastContainer.appendChild(toast);

    // Remove after few seconds
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- Success Logic ---
window.handleYesClick = function () {
    // 1. Confetti Explosion
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // 2. Switch UI
    questionContent.style.display = 'none';
    noBtn.style.display = 'none'; // Hide the No button permanently
    successContent.classList.remove('hidden');
    successContent.classList.add('flex');

    // 3. Add more hearts for celebration background
    setInterval(createHeart, 100); // Faster hearts
}

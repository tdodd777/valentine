// Button Evasion Logic
// No button moves to random position and shrinks when cursor approaches

(function() {
  'use strict';

  const noButton = document.querySelector('.btn-no');
  if (!noButton) return;

  // Configuration
  const CONFIG = {
    proximityThreshold: 100,  // pixels - distance to trigger evasion
    shrinkFactor: 0.85,       // 15% smaller each evasion
    minScale: 0.3,            // minimum 30% of original size
  };

  // State
  let evasionCount = 0;
  let currentScale = 1;
  let currentX = 0;
  let currentY = 0;

  // Initialize - get button's starting position
  function init() {
    // Wait for layout to settle, then capture initial position
    requestAnimationFrame(() => {
      const rect = noButton.getBoundingClientRect();
      // Store current visual center for initial state
      currentX = rect.left;
      currentY = rect.top;
    });
  }

  // Calculate distance from point to button center
  function getDistanceToButton(clientX, clientY) {
    const rect = noButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Get random position within viewport bounds
  function getRandomPosition() {
    const rect = noButton.getBoundingClientRect();

    // Account for current rendered size (includes scale)
    const padding = 20; // Keep away from edges
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    // Ensure non-negative
    const safeMaxX = Math.max(padding, maxX);
    const safeMaxY = Math.max(padding, maxY);

    return {
      x: padding + Math.random() * (safeMaxX - padding),
      y: padding + Math.random() * (safeMaxY - padding)
    };
  }

  // Move button and shrink it
  function evade() {
    evasionCount++;

    // Calculate new scale (with minimum)
    currentScale = Math.max(
      CONFIG.minScale,
      Math.pow(CONFIG.shrinkFactor, evasionCount)
    );

    // Get new random position
    const pos = getRandomPosition();
    currentX = pos.x;
    currentY = pos.y;

    // Apply transform - use left/top as base, translate for animation
    noButton.style.left = '0';
    noButton.style.top = '0';
    noButton.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  }

  // Event handler for pointer movement
  function handlePointerMove(e) {
    const distance = getDistanceToButton(e.clientX, e.clientY);

    if (distance < CONFIG.proximityThreshold) {
      evade();
    }
  }

  // Attach event listener using pointer events for unified mouse/touch
  noButton.addEventListener('pointerenter', evade);
  noButton.addEventListener('pointermove', handlePointerMove);

  // Initialize
  init();
})();

// Celebration Logic
// Yes button triggers multi-layered celebration sequence
(function() {
  'use strict';

  const yesButton = document.querySelector('.btn-yes');
  const celebrationContainer = document.querySelector('.celebration-container');
  const fireworksContainer = document.querySelector('.fireworks-container');
  const mainContent = document.querySelector('.main-content');

  if (!yesButton || !celebrationContainer) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Celebration sequence
  function triggerCelebration() {
    // Disable button to prevent double-trigger
    yesButton.disabled = true;
    yesButton.style.transform = 'scale(1.1)';

    if (prefersReducedMotion) {
      // Static celebration for reduced motion
      if (mainContent) mainContent.style.display = 'none';
      celebrationContainer.classList.add('active');
      return;
    }

    // Layer 1: Immediate confetti burst (0ms)
    confettiExplosion();

    // Layer 2: Show GIF with slight delay (300ms)
    setTimeout(() => {
      if (mainContent) mainContent.style.display = 'none';
      celebrationContainer.classList.add('active');
    }, 300);

    // Layer 3: Continuous hearts from sides (500ms)
    setTimeout(() => {
      heartsConfetti();
    }, 500);

    // Layer 4: Fireworks background (800ms)
    setTimeout(() => {
      startFireworks();
    }, 800);
  }

  // Confetti burst - Valentine colors
  function confettiExplosion() {
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ff69b4', '#ff1744', '#ffb6c1', '#d50000']
    };

    // Left burst
    confetti({
      ...defaults,
      particleCount: 100,
      spread: 60,
      angle: 60
    });

    // Right burst
    confetti({
      ...defaults,
      particleCount: 100,
      spread: 60,
      angle: 120
    });
  }

  // Continuous hearts from both sides
  function heartsConfetti() {
    const duration = 4000; // 4 seconds
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff69b4', '#ff1744'],
        startVelocity: 45,
        gravity: 0.8
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff69b4', '#ff1744'],
        startVelocity: 45,
        gravity: 0.8
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // Fireworks in background
  function startFireworks() {
    if (!fireworksContainer) return;

    const fireworks = new Fireworks.default(fireworksContainer, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      explosion: 5,
      intensity: 15,
      flickering: 50,
      lineStyle: 'round',
      hue: { min: 320, max: 360 }, // Pink to red hues
      delay: { min: 30, max: 60 },
      rocketsPoint: { min: 0, max: 100 },
      lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
      brightness: { min: 50, max: 80 },
      decay: { min: 0.015, max: 0.03 },
      mouse: { click: false, move: false, max: 1 }
    });

    fireworks.start();

    // Stop after 5 seconds
    setTimeout(() => {
      fireworks.stop();
    }, 5000);
  }

  // Attach event listener
  yesButton.addEventListener('click', triggerCelebration);
})();

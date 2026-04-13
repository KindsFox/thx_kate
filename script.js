(function () {
  'use strict';

  const CONFETTI_COLORS = [
    '#d4a574', '#e8a0b4', '#c76b8a', '#f0d5b0',
    '#6b3a5e', '#FFD700', '#FF69B4', '#87CEEB'
  ];

  const PARTICLE_COLORS = [
    'rgba(212,165,116,0.4)',
    'rgba(232,160,180,0.3)',
    'rgba(199,107,138,0.3)',
    'rgba(240,213,176,0.3)'
  ];

  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const particlesContainer = document.getElementById('particles');

  let confettiPieces = [];
  let confettiActive = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class ConfettiPiece {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = Math.random() * 4 - 2;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 10 - 5;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.opacity = 1;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.1 + 0.05;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.wobble) * 0.5 + this.speedX * 0.3;
      this.wobble += this.wobbleSpeed;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 20) {
        this.opacity = 0;
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function launchConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 150; i++) {
      const piece = new ConfettiPiece();
      piece.y = -Math.random() * 200;
      confettiPieces.push(piece);
    }
    confettiActive = true;
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = 0;
    confettiPieces.forEach(function (p) {
      p.update();
      p.draw();
      if (p.opacity > 0) alive++;
    });

    if (alive > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function initParticles() {
    for (let i = 0; i < 25; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = Math.random() * 8 + 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      p.style.animationDuration = (Math.random() * 10 + 8) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      particlesContainer.appendChild(p);
    }
  }

  function createSparkles(container, count) {
    for (let i = 0; i < count; i++) {
      var s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      var size = Math.random() * 8 + 4;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      container.appendChild(s);
    }
  }

  function initScrollAnimations() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    var targets = document.querySelectorAll(
      '.section-title, .cake-container, .photo-frame, ' +
      '.wishes-title, .wish-card, .final-message'
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initWishesConfetti() {
    var wishesSection = document.getElementById('wishes');
    var wishesObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            launchConfetti();
            wishesObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    wishesObserver.observe(wishesSection);
  }

  function createPopper(x, y) {
    var container = document.createElement('div');
    container.className = 'popper';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    document.body.appendChild(container);

    for (let i = 0; i < 12; i++) {
      var p = document.createElement('div');
      p.className = 'popper-particle';
      var angle = (Math.PI * 2 * i) / 12;
      var distance = Math.random() * 80 + 40;
      p.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      var size = Math.random() * 6 + 4;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      container.appendChild(p);
    }

    setTimeout(function () {
      container.remove();
    }, 1500);
  }

  function initClickPoppers() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.scroll-hint')) return;
      createPopper(e.clientX, e.clientY);
    });
  }

  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    initParticles();
    createSparkles(document.querySelector('.hero'), 20);
    createSparkles(document.querySelector('.wishes-section'), 15);
    initScrollAnimations();
    initClickPoppers();
    initWishesConfetti();

    setTimeout(launchConfetti, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

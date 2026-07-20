document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Сайт загружен!');

  // ===== 1. ЗВЁЗДЫ =====
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) {
    console.error('❌ Canvas не найден!');
    return;
  }
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouseX = 0;
  let mouseY = 0;
  let isMobile = window.innerWidth <= 768;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isMobile = window.innerWidth <= 768;
  }

  function createStars() {
    stars = [];
    const count = isMobile ? 10 : 15;
    const minSize = isMobile ? 12 : 20;
    const maxSize = isMobile ? 22 : 50;
    const minOpacity = isMobile ? 0.15 : 0.25;
    const maxOpacity = isMobile ? 0.3 : 0.6;

    for (let i = 0; i < count; i++) {
      stars.push(new Star(minSize, maxSize, minOpacity, maxOpacity));
    }
  }

  class Star {
    constructor(minSize, maxSize, minOpacity, maxOpacity) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (maxSize - minSize) + minSize;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.005;
      this.points = 5;
      this.outerRadius = this.size;
      this.innerRadius = this.size * 0.4;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.color = '#0b1a33';
      this.strokeColor = 'rgba(11, 26, 51, 0.15)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < -150) this.x = canvas.width + 150;
      if (this.x > canvas.width + 150) this.x = -150;
      if (this.y < -150) this.y = canvas.height + 150;
      if (this.y > canvas.height + 150) this.y = -150;

      this.rotation += this.rotationSpeed;
      this.twinklePhase += this.twinkleSpeed;

      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250 && dist > 0) {
        const force = (250 - dist) / 250 * 0.6;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
    }

    draw() {
      const twinkle = Math.sin(this.twinklePhase) * 0.2 + 0.8;
      const finalOpacity = this.opacity * twinkle;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = finalOpacity;

      ctx.shadowColor = 'rgba(11, 26, 51, 0.3)';
      ctx.shadowBlur = Math.min(25, this.size * 0.5);

      ctx.beginPath();
      for (let i = 0; i < this.points * 2; i++) {
        const radius = i % 2 === 0 ? this.outerRadius : this.innerRadius;
        const angle = (i / (this.points * 2)) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.globalAlpha = finalOpacity * 0.4;
      ctx.beginPath();
      for (let i = 0; i < this.points * 2; i++) {
        const radius = i % 2 === 0 ? this.outerRadius * 0.25 : this.innerRadius * 0.25;
        const angle = (i / (this.points * 2)) * Math.PI * 2 - Math.PI / 2 + 0.3;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(11, 26, 51, 0.2)';
      ctx.fill();

      ctx.restore();
    }
  }

  resizeCanvas();
  createStars();

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isMobile = window.innerWidth <= 768;
  });

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => star.update());
    stars.forEach(star => star.draw());
    requestAnimationFrame(animateStars);
  }
  animateStars();

  function updatePointerPosition(x, y) {
    mouseX = x;
    mouseY = y;
  }

  document.addEventListener('mousemove', (e) => {
    updatePointerPosition(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) updatePointerPosition(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) updatePointerPosition(touch.clientX, touch.clientY);
  }, { passive: true });

  console.log('⭐ Звёзд создано:', stars.length);

  // ===== 2. БУРГЕР-МЕНЮ =====
  const burgerMenu = document.getElementById('burgerMenu');
  const navLinks = document.getElementById('navLinks');

  if (burgerMenu && navLinks) {
    console.log('🍔 Бургер-меню найдено');

    burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
      console.log('🍔 Бургер клик, открыто:', navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.navbar')) {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  } else {
    console.error('❌ Бургер или навлинкс не найдены!');
  }

  // ===== 3. 3D-ПАРАЛЛАКС =====
  const heroWrapper = document.querySelector('.hero-3d-wrapper');

  function updateParallax(x, y) {
    if (!heroWrapper) return;
    const xPos = (x / window.innerWidth - 0.5) * 6;
    const yPos = (y / window.innerHeight - 0.5) * 6;
    heroWrapper.style.transform = `rotateX(${-yPos}deg) rotateY(${xPos}deg)`;
  }

  document.addEventListener('mousemove', (e) => {
    updateParallax(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) updateParallax(touch.clientX, touch.clientY);
  }, { passive: true });

  // ===== 4. TILT-ЭФФЕКТ =====
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateX(${y * -8}deg)
        rotateY(${x * 8}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });

    card.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = card.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateX(${y * -6}deg)
        rotateY(${x * 6}deg)
        translateY(-4px)
        scale(1.01)
      `;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    }, { passive: true });
  });

  // ===== 5. ПЛАВНАЯ ПОЯВЛЕНИЕ =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.skill-card, .case-card, .example-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px) scale(0.95)';
    el.style.transition = `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`;
    observer.observe(el);
  });

  // ===== 6. ПЛАВНАЯ ПРОКРУТКА =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== 7. АНИМАЦИЯ ПОДКОВЫ =====
  document.querySelectorAll('.nav-horseshoe, .nav-horseshoe-desktop').forEach(el => {
    el.addEventListener('click', function(e) {
      const img = this.querySelector('img');
      if (img) {
        img.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        img.style.transform = 'rotate(1080deg) scale(1.5)';
        setTimeout(() => {
          img.style.transform = 'rotate(0deg) scale(1)';
        }, 1000);
      }
    });
  });

  // ============================================================
  // ===== МОДАЛЬНОЕ ОКНО С ПОДКОВОЙ =====
  // ============================================================

  console.log('🖼 Инициализация модального окна...');

  if (!document.getElementById('imageModal')) {
    var modalDiv = document.createElement('div');
    modalDiv.className = 'image-modal';
    modalDiv.id = 'imageModal';

    var modalContent = document.createElement('div');
    modalContent.className = 'image-modal-content';

    var modalLoading = document.createElement('div');
    modalLoading.className = 'image-modal-loading';
    modalLoading.textContent = '✦ ЗАГРУЗКА ✦';

    var modalImg = document.createElement('img');
    modalImg.id = 'modalImage';
    modalImg.alt = 'Просмотр';
    modalImg.style.display = 'none';

    var modalClose = document.createElement('div');
    modalClose.className = 'image-modal-close';
    modalClose.id = 'modalClose';
    modalClose.innerHTML = '<img src="images/podckova.svg" alt="Закрыть" style="width:36px; height:36px; filter: invert(100%) brightness(100%);" />';

    modalContent.appendChild(modalLoading);
    modalContent.appendChild(modalImg);
    modalDiv.appendChild(modalContent);
    modalDiv.appendChild(modalClose);
    document.body.appendChild(modalDiv);

    console.log('✅ Модальное окно с подковой создано');
  }

  var modal = document.getElementById('imageModal');
  var modalImage = document.getElementById('modalImage');
  var modalCloseBtn = document.getElementById('modalClose');
  var modalLoadingEl = document.querySelector('.image-modal-loading');

  window.openImageModal = function(src) {
    console.log('🖼 Открытие картинки:', src);
    if (!src) {
      console.error('❌ Нет src для картинки');
      return;
    }
    
    modalLoadingEl.style.display = 'block';
    modalLoadingEl.textContent = '✦ ЗАГРУЗКА ✦';
    modalImage.style.display = 'none';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    modalImage.onload = function() {
      console.log('✅ Картинка загружена');
      modalLoadingEl.style.display = 'none';
      modalImage.style.display = 'block';
    };
    
    modalImage.onerror = function() {
      console.error('❌ Ошибка загрузки:', src);
      modalLoadingEl.textContent = '❌ НЕ УДАЛОСЬ ЗАГРУЗИТЬ';
      modalLoadingEl.style.display = 'block';
    };
    
    modalImage.src = src;
  };

  window.closeImageModal = function() {
    console.log('❌ Закрытие модального окна');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function() {
      modalImage.src = '';
      modalImage.style.display = 'none';
      modalLoadingEl.style.display = 'block';
      modalLoadingEl.textContent = '✦ ЗАГРУЗКА ✦';
    }, 300);
  };

  modalCloseBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    window.closeImageModal();
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      window.closeImageModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      window.closeImageModal();
    }
  });

  console.log('✅ Модальное окно с подковой готово!');

  // ============================================================
  // ===== ПРИВЯЗКА КАРТИНОК =====
  // ============================================================

  console.log('📸 Привязка картинок...');

  function bindImages() {
    var allImages = document.querySelectorAll('.example-image img');
    console.log('📸 Найдено картинок в .example-image:', allImages.length);
    
    if (allImages.length === 0) {
      console.warn('⚠️ Картинки не найдены, пробуем ещё раз через 500ms');
      setTimeout(bindImages, 500);
      return;
    }
    
    allImages.forEach(function(img, index) {
      if (!img.hasAttribute('data-image')) {
        var src = img.getAttribute('src');
        if (src) {
          img.setAttribute('data-image', src);
          console.log('✅ Добавлен data-image для картинки', index + 1);
        }
      }
      
      img.style.cursor = 'pointer';
      img.title = 'Нажмите для увеличения';
      
      img.removeEventListener('click', img._modalClick);
      
      img._modalClick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var src = this.getAttribute('data-image') || this.getAttribute('src');
        console.log('🖼 Клик по картинке ' + (index + 1) + ', src:', src);
        if (src) {
          window.openImageModal(src);
        } else {
          console.error('❌ Нет src у картинки', this);
        }
      };
      
      img.addEventListener('click', img._modalClick);
      console.log('✅ Картинка ' + (index + 1) + ' привязана');
    });
    
    console.log('✅ Все картинки привязаны!');
  }

  setTimeout(bindImages, 200);

  // ============================================================
  // ===== СМЕНА ТЕМЫ ПО КРУЖОЧКАМ =====
  // ============================================================

  console.log('🎨 Инициализация смены тем...');

  var allDots = document.querySelectorAll('.color-dot');

  function updateStarsColor() {
    if (document.body.classList.contains('theme-dark')) {
      stars.forEach(star => {
        star.color = '#fcf8f0';
        star.strokeColor = 'rgba(252, 248, 240, 0.15)';
      });
    } else if (document.body.classList.contains('theme-pink')) {
      stars.forEach(star => {
        star.color = '#e8a0b4';
        star.strokeColor = 'rgba(232, 160, 180, 0.15)';
      });
    } else {
      stars.forEach(star => {
        star.color = '#0b1a33';
        star.strokeColor = 'rgba(11, 26, 51, 0.15)';
      });
    }
  }

  function setTheme(theme) {
    document.body.classList.remove('theme-pink', 'theme-dark', 'theme-cream');
    
    if (theme === 'pink') {
      document.body.classList.add('theme-pink');
      console.log('🌸 Розовая тема активирована');
    } else if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      console.log('🌙 Тёмно-синяя тема активирована');
    } else {
      document.body.classList.add('theme-cream');
      console.log('🍦 Кремовая тема активирована (исходная)');
    }
    
    updateStarsColor();
  }

  allDots.forEach(function(dot) {
    dot.addEventListener('click', function(e) {
      e.stopPropagation();
      var theme = this.getAttribute('data-theme');
      if (theme) {
        setTheme(theme);
      }
    });
  });

  console.log('✅ Смена тем готова!');

  // ============================================================
  // ===== ПРЕЛОАДЕР =====
  // ============================================================

  console.log('⏳ Инициализация прелоадера...');

  var preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('hidden');
      console.log('✅ Прелоадер скрыт');
    }
  }

  window.addEventListener('load', function() {
    setTimeout(hidePreloader, 500);
  });

  setTimeout(function() {
    if (preloader && !preloader.classList.contains('hidden')) {
      hidePreloader();
    }
  }, 3000);

  console.log('✅ Прелоадер готов!');
  console.log('✅ Все системы готовы!');
});
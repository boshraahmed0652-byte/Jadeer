const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

menuToggle.addEventListener('click', () => {
  navigation.classList.toggle('open');
});
const navLinks = document.querySelectorAll('.navigation a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
  });
});
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.navigation ul a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(
        `.navigation ul a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px'
});

sections.forEach(section => observer.observe(section));
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));
const filterButtons = document.querySelectorAll('.filter-btn');
const teamCards = document.querySelectorAll('.team-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    teamCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });
  });
});
const partnersContainer = document.querySelector('.partners-slider .partners-container');

if (partnersContainer) {
  const partners = Array.from(partnersContainer.children);
  partners.forEach(partner => {
    partnersContainer.appendChild(partner.cloneNode(true));
  });
}
document.querySelectorAll('.navigation a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 900;
    let startTime = null;

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo(0, startPosition + distance * easeInOut(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        target.classList.add('section-flash');
        setTimeout(() => target.classList.remove('section-flash'), 1000);
      }
    }

    requestAnimationFrame(animate);
  });
});
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 300);
    }
});
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    let start = null;

    function step(time) {
        if (!start) start = time;
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased) + (progress === 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));
const typewriterEl = document.getElementById('typewriter');

if (typewriterEl) {
    const phrases = [
        'فرص جديدة مع الناس اللي تشبهك',
        'تعلّم، طبّق، وابنِ مستقبلك',
        'كن چديرًا بما هو قادم'
    ];

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function type() {
            const current = phrases[phraseIndex];

            if (!deleting) {
                charIndex++;
                typewriterEl.textContent = current.slice(0, charIndex);
                if (charIndex === current.length) {
                    deleting = true;
                    return setTimeout(type, 2000);
                }
                return setTimeout(type, 80);
            }

            charIndex--;
            typewriterEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                return setTimeout(type, 400);
            }
            setTimeout(type, 40);
        }

        typewriterEl.textContent = '';
        type();
    }
}
const slides = document.querySelectorAll('.testimonial');
const dotsBox = document.querySelector('.carousel-dots');

if (slides.length) {
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'الرأي رقم ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); restart(); });
        dotsBox.appendChild(dot);
    });
    const dots = dotsBox.querySelectorAll('button');

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 6000);
    }

    document.querySelector('.carousel-btn.next').addEventListener('click', () => { goTo(current + 1); restart(); });
    document.querySelector('.carousel-btn.prev').addEventListener('click', () => { goTo(current - 1); restart(); });

    const carouselEl = document.querySelector('.carousel');
    carouselEl.addEventListener('mouseenter', () => clearInterval(timer));
    carouselEl.addEventListener('mouseleave', restart);

    goTo(0);
    restart();
}
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
        if (item.open) {
            faqItems.forEach(other => {
                if (other !== item) other.open = false;
            });
        }
    });
});
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

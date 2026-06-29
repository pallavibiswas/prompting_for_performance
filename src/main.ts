import './style.css' 

// -- Content Types --------------
interface SiteConfig {
  title: string;
  subtitle: string;
  videoUrl: string;
}

// -- Load Site Configuration --------------

async function loadSiteConfig(): Promise<void> {
  try {
    const response = await fetch('./content/site-config.json');
    const config: SiteConfig = await response.json();
    
    //Update page title 
    document.title = config.title;

    //inject video if url is set
    if (config.videoUrl) {
      const container = document.getElementById('video-container');
      if (container) {
        container.innerHTML = `
          <iframe
              src="${config.videoUrl}"
              title="Workshop Demo Video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              style="width: 100%; height: 100%; border-radius: 12px;">
          </iframe>
        `;
      } 
    }
  } catch (e) {
      console.warn('site-config.json not loaded:', e);  
  }
}

// -- Scroll Progress Bar --------------

function initProgressBar(): void {
  const bar = document.querySelector<HTMLElement>('.nav-progress-bar');
  const progressEl = document.querySelector<HTMLElement>('.nav-progress');
  if (!bar || !progressEl) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
    progressEl?.setAttribute('aria-valuenow', String(Math.round(pct))) 
  }, { passive: true });
}

// -- Active Nav Link on Scroll --------------
function initActiveNav(): void {  
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  const NAV_H = 80; 

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id)
        })
      }
    })
  }, { rootMargin: `-${NAV_H}px 0px -55% 0px` });

  sections.forEach(s => observer.observe(s));
}

// -- Mobile Hamburger Menu --------------
function initHamburger(): void {
  const btn = document.querySelector<HTMLButtonElement>('.nav-hamburger');
  const links = document.querySelector<HTMLElement>('.nav-links');

  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  })

  //close link on click
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    })
  })

  //close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target as Node) && !links.contains(e.target as Node)) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  })
}

// -- Scroll Reveal Animation --------------
function initReveal(): void {
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s ease-out, transform 0.55s ease-out;
    }
    .reveal.visible {
      opacity: 1;
      transform: none;
    }
  `

  document.head.appendChild(style)

  const targets = document.querySelectorAll('.section-label, .section-title, .section-desc, .placeholder-block, .video-placeholder')
  targets.forEach((el) => el.classList.add('reveal'))

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    })
  }, { threshold: 0.12 });

  targets.forEach((el) => observer.observe(el));
}

// -- Boot --------------
loadSiteConfig();
initProgressBar();
initActiveNav();
initHamburger();
initReveal();

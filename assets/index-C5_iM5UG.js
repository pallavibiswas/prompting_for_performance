(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function e(){try{let e=await(await fetch(`/content/site-config.json`)).json();if(document.title=e.title,e.videoUrl){let t=document.getElementById(`video-container`);t&&(t.innerHTML=`
          <iframe
              src="${e.videoUrl}"
              title="Workshop Demo Video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              style="width: 100%; height: 100%; border-radius: 12px;">
          </iframe>
        `)}}catch(e){console.warn(`site-config.json not loaded:`,e)}}function t(){let e=document.querySelector(`.nav-progress-bar`),t=document.querySelector(`.nav-progress`);!e||!t||window.addEventListener(`scroll`,()=>{let n=window.scrollY,r=document.documentElement.scrollHeight-window.innerHeight,i=r>0?n/r*100:0;e.style.width=`${i}%`,t?.setAttribute(`aria-valuenow`,String(Math.round(i)))},{passive:!0})}function n(){let e=document.querySelectorAll(`section[id]`),t=document.querySelectorAll(`.nav-link`),n=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let n=e.target.getAttribute(`id`);t.forEach(e=>{e.classList.toggle(`active`,e.dataset.section===n)})}})},{rootMargin:`-80px 0px -55% 0px`});e.forEach(e=>n.observe(e))}function r(){let e=document.querySelector(`.nav-hamburger`),t=document.querySelector(`.nav-links`);!e||!t||(e.addEventListener(`click`,()=>{let n=t.classList.toggle(`open`);e.setAttribute(`aria-expanded`,String(n))}),t.querySelectorAll(`a`).forEach(n=>{n.addEventListener(`click`,()=>{t.classList.remove(`open`),e.setAttribute(`aria-expanded`,`false`)})}),document.addEventListener(`click`,n=>{!e.contains(n.target)&&!t.contains(n.target)&&(t.classList.remove(`open`),e.setAttribute(`aria-expanded`,`false`))}))}function i(){if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let e=document.createElement(`style`);e.textContent=`
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s ease-out, transform 0.55s ease-out;
    }
    .reveal.visible {
      opacity: 1;
      transform: none;
    }
  `,document.head.appendChild(e);let t=document.querySelectorAll(`.section-label, .section-title, .section-desc, .placeholder-block, .video-placeholder`);t.forEach(e=>e.classList.add(`reveal`));let n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`visible`),n.unobserve(e.target))})},{threshold:.12});t.forEach(e=>n.observe(e))}e(),t(),n(),r(),i();
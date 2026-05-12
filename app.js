/* ============================================================================
   Vietnamese Medical VQA — interactions
   Plain ES modules-free JS. No bundler. Three things only:
     1. Scroll-reveal via IntersectionObserver (adds .is-visible on entry)
     2. Animated count-up for hero metrics
     3. Chart bars animate to their final widths on first scroll-in
     4. Nav background appears on scroll
     5. BibTeX copy-to-clipboard
   ============================================================================ */

(function () {
  'use strict';

  // ─── 1. Reveal-on-scroll ──────────────────────────────────────────────────
  // We watch every .reveal element. When it crosses 15% into the viewport
  // we add .is-visible. CSS does the fade/translate via transition.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => obs.observe(el));
  } else {
    // Safari < 12, IE, etc.: just show everything.
    reveals.forEach((el) => el.classList.add('is-visible'));
  }


  // ─── 2. Animated count-up for hero metrics ────────────────────────────────
  // Each .metric__value has data-target="55.41" data-decimals="2".
  // We count from 0 to target over ~1.4s with eased progress.
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function animateCount(el, target, decimals, duration) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
      else      el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }

  // Trigger count-up the first time the metrics block becomes visible.
  // The HTML already shows the final value as a fallback for users without JS.
  // We reset to 0 only at the moment we begin animating.
  const metricsBlock = document.querySelector('.metrics');
  if (metricsBlock) {
    const countOnce = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          metricsBlock.querySelectorAll('.metric__value').forEach((el, i) => {
            const target = parseFloat(el.dataset.target);
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            el.textContent = (0).toFixed(decimals);
            setTimeout(() => animateCount(el, target, decimals, 1400), i * 180);
          });
          countOnce.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    countOnce.observe(metricsBlock);
  }


  // ─── 3. Chart bar animation ───────────────────────────────────────────────
  // When the chart enters the viewport, add .is-animated; CSS expands bars.
  const chart = document.getElementById('chart');
  if (chart) {
    const chartObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Force a layout flush first so the initial width:0 sticks,
          // then add the class so the transition fires.
          requestAnimationFrame(() => chart.classList.add('is-animated'));
          chartObs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    chartObs.observe(chart);
  }


  // ─── 4. Nav background on scroll ──────────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    function updateNav() {
      const scrolled = window.scrollY > 32;
      nav.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateNav);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateNav();
  }


  // ─── 5. BibTeX copy-to-clipboard ──────────────────────────────────────────
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const pre = btn.parentElement.querySelector('.footer__bib code');
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent.trim());
        btn.textContent = 'Copied ✓';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = 'Copy BibTeX';
          btn.classList.remove('is-copied');
        }, 2000);
      } catch (err) {
        // Fallback: select the text so the user can copy manually.
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pre);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });


  // ─── 6. Smooth-scroll nav links (fix offset for fixed nav) ───────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset + 4;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

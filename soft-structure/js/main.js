document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const sections = document.querySelectorAll('.ed-item[data-theme]');
  
  // Set up the IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px', // Trigger when section is near the middle of the screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove any existing theme classes
        body.className = body.className.replace(/\btheme-[a-z]+\b/g, '').trim();
        
        // Add the new theme class
        const theme = entry.target.getAttribute('data-theme');
        if (theme) {
          body.classList.add('theme-' + theme);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Observe the hero section to revert to default theme when at the top
  const hero = document.querySelector('.hero-bleed');
  if (hero) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        body.className = body.className.replace(/\btheme-[a-z]+\b/g, '').trim();
      }
    }, { rootMargin: '-10% 0px 0px 0px', threshold: 0 });
    heroObserver.observe(hero);
  }
});

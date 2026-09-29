/* Принцип привязки сцены к прокрутке адаптирован из Aironzak/instagram (MIT):
   https://github.com/Aironzak/instagram/blob/main/plugins/roomwalk/skills/roomwalk/web/scroll_frames_standalone.js */
(() => {
  'use strict';
  const story = document.querySelector('.scroll-story');
  if (!story) return;
  const hero = document.querySelector('.hero-picture');
  const heroImage = hero?.querySelector('img');
  const closing = document.querySelector('.closing-story');
  const closingImage = closing?.querySelector('img');
  const images = [...story.querySelectorAll('.story-image')];
  const number = story.querySelector('.story-number');
  const heading = story.querySelector('.story-heading');
  const detail = story.querySelector('.story-detail');
  const rail = story.querySelector('.story-rail span');
  const steps = [
    ['Наметить направления', 'Интересы, особенности и контекст семьи.'],
    ['Проверить в действии', 'Малые пробы и реальные задачи.'],
    ['Выбрать образование', 'Навыки, программа и вуз с опорой на направление.'],
    ['Получить опыт', 'Практика, проекты и обратная связь.'],
    ['Развиваться в профессии', 'Опыт, мастерство и профессиональный рост.']
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = -1;
  let pending = false;

  function update() {
    pending = false;
    const rect = story.getBoundingClientRect();
    const sticky = story.querySelector('.story-sticky').getBoundingClientRect().height;
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - sticky)));
    const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    if (index !== last) {
      number.textContent = String(index + 1).padStart(2, '0') + ' / 05';
      heading.textContent = steps[index][0];
      detail.textContent = steps[index][1];
      images.forEach((image, i) => image.classList.toggle('is-visible', i === index));
      last = index;
    }
    if (!reduced) {
      if (heroImage) {
        const heroRect = hero.getBoundingClientRect();
        const distance = (heroRect.top + heroRect.height / 2 - innerHeight / 2) / Math.max(1, innerHeight);
        const offsetHero = Math.max(-45, Math.min(45, Math.round(distance * 45)));
        heroImage.style.transform = `scale(1.12) translate3d(0, ${offsetHero}px, 0)`;
      }
      if (closingImage) {
        const closingRect = closing.getBoundingClientRect();
        const closingHeight = closing.querySelector('.closing-sticky').getBoundingClientRect().height;
        const closingProgress = Math.max(0, Math.min(1, -closingRect.top / Math.max(1, closingRect.height - closingHeight)));
        const reveal = Math.max(0, Math.min(1, (innerHeight - closingRect.top) / Math.max(1, innerHeight)));
        closingImage.style.opacity = String(reveal);
        closingImage.style.transform = `scale(1.08) translate3d(0, ${Math.round((closingProgress - .5) * -60)}px, 0)`;
      }
      const offset = Math.round((progress - .5) * -50);
      images.forEach(image => { image.style.transform = `scale(1.10) translate3d(0, ${offset}px, 0)`; });
      story.style.setProperty('--story-float', `${Math.round((progress - .5) * 26)}px`);
      rail.style.height = `${Math.max(5, progress * 100)}%`;
    }
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  update();
})();

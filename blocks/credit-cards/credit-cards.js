import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  [...block.children].forEach(child => {
    const li = document.createElement('div');
    moveInstrumentation(child, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach(divContainer => {
      if (divContainer.children.length === 1) {
        const parentDiv = document.querySelector('div');
        const cfPath = parentDiv.querySelector('a')?.title;
      }
    });
    cardContainer.append(li);
  });
  block.textContent = '';
  block.append(cardContainer);
}

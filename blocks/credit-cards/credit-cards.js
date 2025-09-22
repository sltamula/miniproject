import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  [...block.children].forEach(row => {
    const li = document.createElement('div');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
  });
  block.textContent = '';
  block.append(cardContainer);
}

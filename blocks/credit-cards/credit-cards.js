import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  [...block.children].forEach(row => {
    const li = document.createElement('div');
    moveInstrumentation(row, li);
    while (row.firstElementChild) console.log('Hello');

    cardContainer.append(li);
  });
  block.textContent = '';
  block.append(cardContainer);
}

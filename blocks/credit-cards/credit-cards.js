import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  [...block.children].forEach(row => {
    const divContainer = document.createElement('div');
    moveInstrumentation(row, divContainer);
    while (row.firstElementChild) divContainer.append(row.firstElementChild);
    [...divContainer.children].forEach(div => {
      if (div.children.length === 1) {
        console.log('Hello');
      }
    });
    cardContainer.append(divContainer);
  });
  block.textContent = '';
  block.append(cardContainer);
}

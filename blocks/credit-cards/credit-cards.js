import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach(row => {
    const div = document.createElement('div');
    while (row.firstElementChild) div.append(row.firstElementChild);
  });

  block.textContent = '';
  block.append(ul);
}

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function renderContent(block, details, children) {
  // Clear existing content from the block
  block.innerHTML = '';

  const [, linkDiv, buttonTextDiv] = children;
  //const authoredButtonText = linkDiv.textContent.trim();
  //const authoredLink = children[1].querySelector('a')?.href;

  // Create card container
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.className = 'credit-card__body';

  // Create and append card details
  const elementsToCreate = [
    { tag: 'img', src: details.image._path, className: 'credit-card__image' },
    { tag: 'h3', textContent: details.name, className: 'credit-card__name' },
    {
      tag: 'div',
      innerHTML: details.description.html,
      className: 'credit-card__description',
    },
    {
      tag: 'div',
      innerHTML: details.cardFeatures.html,
      className: 'credit-card__features',
    },
    {
      tag: 'div',
      innerHTML: details.cardBenefits.html,
      className: 'credit-card__benefits',
    },
  ];

  elementsToCreate.forEach(
    ({ tag, src, textContent, innerHTML, className }) => {
      const element = document.createElement(tag);

      if (src) element.src = src;
      if (textContent) element.textContent = textContent;
      if (innerHTML) element.innerHTML = innerHTML;
      if (className) element.className = className;

      // Append the image to the main container, everything else to the body
      if (tag === 'img') {
        cardContainer.appendChild(element);
      } else {
        cardBodyContainer.appendChild(element);
      }
    }
  );

  // Append the populated card body to the main card container
  cardContainer.appendChild(cardBodyContainer);

  // Handle button generation
  //createButton(cardContainer, authoredLink, authoredButtonText);

  // Append the card container to the block
  block.appendChild(cardContainer);

  // Hide the original divs
  linkDiv.style.display = 'none';
  buttonTextDiv.style.display = 'none';
}

export default function decorate(block) {
  const children = [...block.children];
  const cfPath = children[0].querySelector('a')?.title;

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach(row => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach(div => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        if (!cfPath) {
          console.error('Content fragment path not found.');
          return;
        }

        const url = `${API_ENDPOINT};path=${cfPath}`;
        const cfData = await response.json();
    const ccDetails = cfData?.data?.creditCardContainerByPath?.item;
        renderContent(block, ccDetails, children);
      } else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach(img => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}

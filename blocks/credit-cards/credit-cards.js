import { moveInstrumentation } from '../../scripts/scripts.js';

function renderContent(block, ccDetails) {
  // Clear existing content from the block
  //block.innerHTML = '';

  // Create card container
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.className = 'credit-card__body';

  // Create and append card details
  const elementsToCreate = [
    { tag: 'img', src: ccDetails.image._path, className: 'credit-card__image' },
    { tag: 'h3', textContent: ccDetails.name, className: 'credit-card__name' },
    {
      tag: 'div',
      innerHTML: ccDetails.description.html,
      className: 'credit-card__description',
    },
    {
      tag: 'div',
      innerHTML: ccDetails.cardFeatures.html,
      className: 'credit-card__features',
    },
    {
      tag: 'div',
      innerHTML: ccDetails.cardBenefits.html,
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
}

async function getContentFragmentDetails(block, cfPath) {
  const API_ENDPOINT =
    'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

  if (cfPath) {
    const url = `${API_ENDPOINT};path=${cfPath}`;
    const response = await fetch(url);

    if (response.ok) {
      const cfData = await response.json();
      const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

      if (ccDetails) {
        renderContent(block, ccDetails);
      } else {
        console.error('No credit card details found in content fragment.');
      }
    }
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const parentDivContainer = document.createElement('div');

  [...block.children].forEach(row => {
    const li = document.createElement('div');
    const templi = document.createElement('div');
    moveInstrumentation(row, li);
    while (row.firstElementChild) templi.append(row.firstElementChild);
    [...templi.children].forEach(divContainer => {
      if (divContainer.children.length !== 1) return;
      const notAButton = divContainer
        .querySelector('a')
        ?.getAttribute('data-aue-prop');

      if (notAButton) {
        li.appendChild(divContainer);
      } else {
        const cfPath = divContainer.querySelector('a')?.title;
        getContentFragmentDetails(li, cfPath);
      }
    });
    parentDivContainer.append(li);
  });
  block.textContent = '';
  block.append(parentDivContainer);
}

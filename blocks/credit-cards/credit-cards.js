import { moveInstrumentation } from '../../scripts/scripts.js';

function renderContent(block, ccDetails) {
  // Create card container
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card-container';

  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.className = 'credit-card-body';

  // Create and append card details
  const elementsToCreate = [
    { tag: 'img', src: ccDetails.image._path, className: 'credit-card-image' },
    { tag: 'h3', textContent: ccDetails.name, className: 'credit-card-name' },
    {
      tag: 'div',
      innerHTML: ccDetails.description.html,
      className: 'credit-card-description',
    },
    {
      tag: 'div',
      innerHTML: ccDetails.cardFeatures.html,
      className: 'credit-card-features',
    },
    {
      tag: 'div',
      innerHTML: ccDetails.cardBenefits.html,
      className: 'credit-card-benefits',
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

  // prepend the card container to the block
  block.prepend(cardContainer);
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
  const parentDiv = document.createElement('div');
  parentDiv.className = 'credit-card--main';

  [...block.children].forEach(ccItem => {
    const creditCardDiv = document.createElement('div');
    creditCardDiv.className = 'credit-card';

    moveInstrumentation(ccItem, creditCardDiv);

    [...ccItem.children].forEach(divContainer => {
      if (divContainer.children.length !== 1) return;

      const isButton = divContainer
        .querySelector('a')
        ?.getAttribute('data-aue-prop');

      if (isButton) {
        const buttonLink = divContainer.querySelector('a').href;
        const openInNewTab = divContainer
          .querySelector('p')
          .textContent.toLowerCase();
        if (openInNewTab === 'true') {
          window.open(buttonLink, '_blank');
        }
        creditCardDiv.appendChild(divContainer.firstElementChild);
      } else {
        const cfPath = divContainer.querySelector('a')?.title;
        getContentFragmentDetails(creditCardDiv, cfPath);
      }
    });
    parentDiv.append(creditCardDiv);
  });
  block.textContent = '';
  block.append(parentDiv);
}

import { moveInstrumentation } from '../../scripts/scripts.js';

function renderContent(block, ccDetails) {
  // main container for the credit card.
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card-container';

  // inner container for credit card body
  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.className = 'credit-card-body';

  // list of different elements and its content
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

      //apply all the properties to the created element
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

  if (!cfPath) {
    console.error('Content fragment path (cfPath) is missing.');
    return;
  }

  const url = `${API_ENDPOINT};path=${cfPath}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Network response was not ok, status: ${response.status}`
      );
    }

    const cfData = await response.json();
    const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

    if (ccDetails) {
      // Assuming renderContent is an existing function.
      renderContent(block, ccDetails);
    } else {
      console.error(
        'No credit card details found at the specified content fragment path.'
      );
    }
  } catch (error) {
    console.error('Failed to fetch or process credit card details:', error);
  }

  // if (cfPath) {
  //   const url = `${API_ENDPOINT};path=${cfPath}`;
  //   const response = await fetch(url);

  //   if (response.ok) {
  //     const cfData = await response.json();
  //     const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

  //     if (ccDetails) {
  //       renderContent(block, ccDetails);
  //     } else {
  //       console.error('No credit card details found in content fragment.');
  //     }
  //   }
  // }
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

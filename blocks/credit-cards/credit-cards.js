import { moveInstrumentation } from '../../scripts/scripts.js';

async function getContentFragmentDetails(cfPath) {
  const API_ENDPOINT =
    'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

  if (cfPath) {
    const url = `${API_ENDPOINT};path=${cfPath}`;
    const response = await fetch(url);

    if (response.ok) {
      const cfData = await response.json();
      const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

      if (ccDetails) {
        //renderContent(ccDetails);
        console.log('Hello');
      } else {
        console.error('No credit card details found in content fragment.');
      }
    }
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  [...block.children].forEach(row => {
    const li = document.createElement('div');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach(divContainer => {
      if (divContainer.children.length === 1) {
        const parentDiv = document.querySelector('div');
        const cfPath = parentDiv.querySelector('a')?.title;
        getContentFragmentDetails(cfPath);
      }
    });
    cardContainer.append(li);
  });
  block.textContent = '';
  block.append(cardContainer);
}

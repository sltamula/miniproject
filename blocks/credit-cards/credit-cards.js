import {
  createButton,
  renderContent,
} from '../../scripts/credit-card-script.js';

const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

export default async function decorate(block) {
  const ul = document.createElement('ul');
  const children = [...block.children];

  const cfPath = children[0]?.querySelector('a')?.title;
  const authoredButtonText = children[1]?.textContent.trim();
  const authoredLink = children[1]?.querySelector('a')?.href;

  if (!cfPath) {
    console.error('Content fragment path not found.');
    return;
  }

  const url = `${API_ENDPOINT};path=${cfPath}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cfData = await response.json();
    const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

    if (ccDetails) {
      const li = document.createElement('li');
      renderContent(ccDetails, li);

      const buttonWrapper = document.createElement('div');
      createButton(buttonWrapper, authoredLink, authoredButtonText);
      li.append(buttonWrapper);

      ul.append(li);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Hide the original divs.
  children.forEach(child => child.remove());

  // Append the new structure to the block.
  block.append(ul);
}

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

/**
 * Entry point for the block decoration.
 * @param {HTMLElement} block The block element.
 */
export default async function decorate(block) {
  const children = [...block.children];

  const cfPath = children[0]?.querySelector('a')?.title;
  const buttonTextDiv = children[1];
  const authoredButtonText = buttonTextDiv?.textContent.trim();
  const authoredLink = children[1]?.querySelector('a')?.href;

  // Clear the original HTML from the block
  block.textContent = '';

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
      const cardContainer = document.createElement('div');
      cardContainer.className = 'credit-card__container';

      const image = createOptimizedPicture(
        ccDetails.image._path,
        ccDetails.name,
        false,
        [{ width: '750' }]
      );
      const cardImageDiv = document.createElement('div');
      cardImageDiv.className = 'credit-card__image';
      cardImageDiv.append(image);

      const cardBodyDiv = document.createElement('div');
      cardBodyDiv.className = 'credit-card__body';

      // Create and append card details using a single append call
      const nameHeading = document.createElement('h3');
      nameHeading.className = 'credit-card__name';
      nameHeading.textContent = ccDetails.name;

      const descriptionDiv = document.createElement('div');
      descriptionDiv.className = 'credit-card__description';
      descriptionDiv.innerHTML = ccDetails.description.html;

      const featuresDiv = document.createElement('div');
      featuresDiv.className = 'credit-card__features';
      featuresDiv.innerHTML = ccDetails.cardFeatures.html;

      const benefitsDiv = document.createElement('div');
      benefitsDiv.className = 'credit-card__benefits';
      benefitsDiv.innerHTML = ccDetails.cardBenefits.html;

      cardBodyDiv.append(nameHeading, descriptionDiv, featuresDiv, benefitsDiv);

      const buttonLink = document.createElement('a');
      buttonLink.className = 'button';
      buttonLink.href = authoredLink || '#';
      buttonLink.textContent = authoredButtonText || 'Learn More';

      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'btn-wrapper';
      buttonWrapper.append(buttonLink);

      // Append all parts to the card container
      cardContainer.append(cardImageDiv, cardBodyDiv, buttonWrapper);

      // Append the final container to the block
      block.append(cardContainer);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

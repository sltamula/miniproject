import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const API_ENDPOINT = 'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

/**
 * Creates and appends a button to a container.
 * @param {HTMLElement} container The element to append the button to.
 * @param {string} path The href path for the button link.
 * @param {string} text The text content for the button.
 */
function createButton(container, path, text) {
  const buttonLink = document.createElement('a');
  buttonLink.href = path || '#';
  buttonLink.textContent = text || 'Learn More';
  buttonLink.classList.add('button');

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'btn-wrapper';
  
  const newButtonDiv = document.createElement('div');
  newButtonDiv.className = 'btn';
  newButtonDiv.append(buttonLink);
  buttonDiv.append(newButtonDiv);
  container.append(buttonDiv);
}

/**
 * Renders a single credit card item.
 * @param {object} details The fetched credit card details.
 * @param {HTMLElement} contentDiv The element to append content to.
 */
function renderCardItem(details, contentDiv) {
  const picture = createOptimizedPicture(details.image._path, details.name, false, [{ width: '750' }]);
  
  const cardImageDiv = document.createElement('div');
  cardImageDiv.className = 'cards-card-image';
  cardImageDiv.append(picture);
  
  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'cards-card-body';

  const heading = document.createElement('h3');
  heading.textContent = details.name;

  const description = document.createElement('div');
  description.innerHTML = details.description.html;

  const features = document.createElement('div');
  features.innerHTML = details.cardFeatures.html;

  const benefits = document.createElement('div');
  benefits.innerHTML = details.cardBenefits.html;
  
  cardBodyDiv.append(heading, description, features, benefits);
  contentDiv.append(cardImageDiv, cardBodyDiv);
}

/**
 * Entry point for the block decoration.
 * @param {HTMLElement} block The block element.
 */
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
      renderCardItem(ccDetails, li);
      
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

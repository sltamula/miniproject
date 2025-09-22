import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// The API endpoint should be a constant outside the function
const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

/**
 * Creates and appends a button to a container.
 * @param {HTMLElement} parent The element to append the button to.
 * @param {string} path The href path.
 * @param {string} text The text content.
 */
function createButton(parent, path, text) {
  const buttonLink = document.createElement('a');
  buttonLink.href = path || '#';
  buttonLink.textContent = text || 'Learn More';
  buttonLink.className = 'button';

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'btn-wrapper';
  buttonDiv.append(buttonLink);

  parent.append(buttonDiv);
}

/**
 * Creates and renders a card item from fetched data.
 * @param {HTMLElement} parent The parent element (e.g., an <li>).
 * @param {object} details The fetched content fragment data.
 * @param {string} buttonText The authored button text.
 * @param {string} buttonLink The authored button link.
 */
function renderCardItem(parent, details, buttonText, buttonLink) {
  const imageDiv = document.createElement('div');
  imageDiv.className = 'cards-card-image';
  const optimizedPic = createOptimizedPicture(
    details.image._path,
    details.name,
    false,
    [{ width: '750' }]
  );
  imageDiv.append(optimizedPic);

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'cards-card-body';

  const heading = document.createElement('h3');
  heading.textContent = details.name;

  const description = document.createElement('div');
  description.innerHTML = details.description.html;

  const features = document.createElement('div');
  features.innerHTML = details.cardFeatures.html;

  const benefits = document.createElement('div');
  benefits.innerHTML = details.cardBenefits.html;

  bodyDiv.append(heading, description, features, benefits);

  parent.append(imageDiv, bodyDiv);
  createButton(parent, buttonLink, buttonText);
}

/**
 * The main decorate function for the block.
 * @param {HTMLElement} block The block element.
 */
export default async function decorate(block) {
  // Clear the block's content before processing
  const ul = document.createElement('ul');

  // Find the original content fragment path, button text, and link
  const originalChildren = [...block.children];
  const cfPath = originalChildren[0]?.querySelector('a')?.title;
  const buttonText = originalChildren[1]?.textContent.trim();
  const buttonLink = originalChildren[1]?.querySelector('a')?.href;

  if (!cfPath) {
    console.error('Content fragment path not found.');
    block.textContent = 'Error: Content fragment path not found.';
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
      renderCardItem(li, ccDetails, buttonText, buttonLink);
      ul.append(li);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Append the new structure to the block.
  block.textContent = '';
  block.append(ul);
}

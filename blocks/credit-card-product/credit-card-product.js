const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

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

  const newButtonDiv = document.createElement('div');
  newButtonDiv.append(buttonLink);
  container.append(newButtonDiv);
}

/**
 * Renders the credit card details and a button.
 * @param {HTMLElement} block The main block element.
 * @param {object} details The fetched credit card details.
 * @param {HTMLElement[]} children An array of the block's children elements.
 */
function renderContent(block, details, children) {
  // Clear existing content from the block
  block.innerHTML = '';

  const [, linkDiv, buttonTextDiv] = children;
  const authoredLink =
    linkDiv.querySelector('a')?.href.replace('.html', '') || '';
  const authoredButtonText = buttonTextDiv.textContent.trim();

  // Create card container
  const cardContainer = document.createElement('div');
  cardContainer.className = 'credit-card__container';

  const cardImage = document.createElement('img');
  cardImage.src = details.image._path;
  cardImage.className = 'credit-card__image';

  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.className = 'credit-card__body';

  const cardName = document.createElement('h3');
  cardName.textContent = details.name;
  cardName.className = 'credit-card__name';

  const cardDescription = document.createElement('div');
  cardDescription.innerHTML = details.description.html;
  cardDescription.className = 'credit-card__description';

  const cardFeatures = document.createElement('div');
  cardFeatures.innerHTML = details.cardFeatures.html;
  cardFeatures.className = 'credit-card__features';

  const cardBenefits = document.createElement('div');
  cardBenefits.innerHTML = details.cardBenefits.html;
  cardBenefits.className = 'credit-card__benefits';

  cardBodyContainer.append(
    cardName,
    cardDescription,
    cardFeatures,
    cardBenefits
  );

  // Handle button generation
  if (!authoredLink || authoredLink === 'Path') {
    const cfPath =
      children[0].querySelector('a')?.href.replace('.html', '') || '';
    createButton(cardBodyContainer, cfPath, authoredButtonText);
  } else {
    createButton(cardBodyContainer, authoredLink, authoredButtonText);
  }

  cardContainer.append(cardImage, cardBodyContainer);
  block.append(cardContainer);

  // Hide the original divs
  children[0].style.display = 'none';
  linkDiv.style.display = 'none';
  buttonTextDiv.style.display = 'none';
}

/**
 * Entry point for the block decoration.
 * @param {HTMLElement} block The block element.
 */
export default async function decorate(block) {
  const children = [...block.children];
  const cfPath = children[0].querySelector('a')?.href;

  if (!cfPath) {
    console.error('Content fragment path not found.');
    return;
  }

  const url = `${API_ENDPOINT};path=${cfPath.replace('.html', '')}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cfData = await response.json();
    const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

    if (ccDetails) {
      renderContent(block, ccDetails, children);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

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
  const authoredButtonText = linkDiv.textContent.trim();
  const authoredLink = children[1].querySelector('a')?.href;
  const cfPath = children[0].querySelector('a')?.title;

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
      // const element = document.createElement(tag);
      // if (src) element.src = src;
      // if (textContent) element.textContent = textContent;
      // if (innerHTML) element.innerHTML = innerHTML;
      // if (className) element.className = className;

      const element = document.createElement(tag);
      if (className && className !== 'credit-card__image') {
        element.src = src;
        element.textContent = textContent;
        element.innerHTML = innerHTML;
        element.className = className;
        cardBodyContainer.appendChild(element);
      } cardContainer.appendChild(element);
      }
    }
  );

  // Handle button generation
  createButton(cardContainer, authoredLink, authoredButtonText);

  // Append the card container to the block
  block.appendChild(cardContainer);

  // Hide the original divs
  linkDiv.style.display = 'none';
  buttonTextDiv.style.display = 'none';
}

/**
 * Entry point for the block decoration.
 * @param {HTMLElement} block The block element.
 */
export default async function decorate(block) {
  const children = [...block.children];
  const cfPath = children[0].querySelector('a')?.title;

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
      renderContent(block, ccDetails, children);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

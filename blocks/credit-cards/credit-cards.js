const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

function createButton(container, path, text) {
  const buttonLink = document.createElement('a');
  buttonLink.href = path || '#';
  buttonLink.textContent = text || 'Learn More';
  buttonLink.classList.add('button');

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'btn-wrapper';
  container.append(buttonDiv);

  const newButtonDiv = document.createElement('div');
  newButtonDiv.className = 'btn';
  newButtonDiv.append(buttonLink);
  buttonDiv.append(newButtonDiv);
}

function renderContent(block, details, children) {
  // Clear existing content from the block
  block.innerHTML = '';

  const [, linkDiv, buttonTextDiv] = children;
  const authoredButtonText = linkDiv.textContent.trim();
  const authoredLink = children[1].querySelector('a')?.href;

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

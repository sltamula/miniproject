const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

/**
 * Creates an optimized picture element with the specified source and alt text.
 * @param {string} src The image source path.
 * @param {string} alt The image alt text.
 * @returns {HTMLPictureElement} The optimized picture element.
 */
function createOptimizedPicture(src, alt) {
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  picture.append(img);
  return picture;
}

/**
 * Entry point for the block decoration.
 * @param {HTMLElement} block The block element.
 */
export default async function decorate(block) {
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
      block.innerHTML = '';
      const cardContainer = document.createElement('div');
      cardContainer.className = 'credit-card__container';

      const image = createOptimizedPicture(ccDetails.image._path, ccDetails.name);

      const heading = document.createElement('h3');
      heading.textContent = ccDetails.name;

      const description = document.createElement('div');
      description.innerHTML = ccDetails.description.html;

      const features = document.createElement('div');
      features.innerHTML = ccDetails.cardFeatures.html;

      const benefits = document.createElement('div');
      benefits.innerHTML = ccDetails.cardBenefits.html;
      
      const buttonLink = document.createElement('a');
      buttonLink.href = authoredLink || '#';
      buttonLink.textContent = authoredButtonText || 'Learn More';
      buttonLink.classList.add('button');
      
      cardContainer.append(image, heading, description, features, benefits, buttonLink);
      block.append(cardContainer);

    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

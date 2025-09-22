const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

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

      const cardBodyContainer = document.createElement('div');
      cardBodyContainer.className = 'credit-card__body';

      const image = document.createElement('img');
      image.src = ccDetails.image._path;
      image.className('credit-card__image');

      const name = document.createElement('h3');
      name.textContent = ccDetails.name;
      name.className('credit-card__name');

      const description = document.createElement('div');
      description.innerHTML = ccDetails.description.html;
      description.className('credit-card__description');

      const features = document.createElement('div');
      features.innerHTML = ccDetails.cardFeatures.html;
      features.className('credit-card__features');

      const benefits = document.createElement('div');
      benefits.innerHTML = ccDetails.cardBenefits.html;
      benefits.className('credit-card__benefits');

      const buttonLink = document.createElement('a');
      buttonLink.href = authoredLink || '#';
      buttonLink.textContent = authoredButtonText || 'Learn More';
      buttonLink.classList.add('button');

      cardBodyContainer.append(
        name,
        description,
        features,
        benefits,
        buttonLink
      );

      cardContainer.append(image, cardBodyContainer);
      block.append(cardContainer);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default async function decorate(block) {
  const fragmentPath = block.textContent.trim();

  // Correct: Construct the full URL for the persisted query, including variables.
  const url = `https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails;path=${fragmentPath}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cfData = await response.json();
    console.log(cfData);
    const ccDetails = cfData.data.creditCardContainerByPath.item;

    block.innerHTML = ''; // Clear existing content

    // Render the fetched data
    if (ccDetails) {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'credit-card__container';

      const cardName = document.createElement('h1');
      cardName.textContent = ccDetails.name;
      cardName.className = 'credit-card__name';

      const cardImage = document.createElement('img');
      cardImage.src = ccDetails.image['_path'];
      cardImage.className = 'credit-card__image';

      const cardDescription = document.createElement('div');
      cardDescription.textContent = ccDetails.description.html;
      cardDescription.className = 'credit-card__description';

      const cardFeatures = document.createElement('div');
      cardFeatures.textContent = ccDetails.cardFeatures.html;
      cardFeatures.className = 'credit-card__features';

      const cardBenefits = document.createElement('div');
      cardBenefits.textContent = ccDetails.cardBenefits.html;
      cardBenefits.className = 'credit-card__benfits';

      cardContainer.append(
        cardName,
        cardImage,
        cardFeatures,
        cardBenefits,
        cardDescription
      );

      block.appendChild(cardContainer);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // or throw an error
  }
}

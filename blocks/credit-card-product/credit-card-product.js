export default async function decorate(block) {
  const fragmentPath = block.textContent.trim();

  // Construct the URL for the persisted query
  const url = `https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject-site/getCCdetails;path=${encodeURIComponent(
    fragmentPath
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const ccDetails = json.data.customCreditCardList.items;

    block.innerHTML = ''; // Clear existing content

    // Render the fetched data
    if (ccDetails.length > 0) {
      ccDetails.forEach(ccDetail => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'credit-card__container';

        const cardName = document.createElement('h1');
        cardName.textContent = ccDetail.name;
        cardName.className = 'credit-card__name';

        const cardImage = document.createElement('img');
        cardImage.src = ccDetail.image['_path'];
        cardImage.className = 'credit-card__image';

        const cardHeader = document.createElement('div');
        cardHeader.textContent = ccDetail.customHeader;
        cardHeader.className = 'credit-card__header';

        const cardDescription = document.createElement('div');
        cardDescription.textContent = ccDetail.description.html;
        cardDescription.className = 'credit-card__description';

        const cardFeatures = document.createElement('div');
        cardFeatures.textContent = ccDetail.cardFeatures.html;
        cardFeatures.className = 'credit-card__features';

        const cardBenefits = document.createElement('div');
        cardBenefits.textContent = ccDetail.extraBenefits.html;
        cardBenefits.className = 'credit-card__benfits';

        cardContainer.append(
          cardName,
          cardImage,
          cardHeader,
          cardFeatures,
          cardBenefits,
          cardDescription
        );

        block.appendChild(cardContainer);
      });
    }
  } catch (e) {
    console.error('Failed to load content fragment:', e);
    block.textContent = 'Failed to load content.';
  }
}

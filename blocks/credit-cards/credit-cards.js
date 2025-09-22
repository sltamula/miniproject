const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

/**
 * Fetches credit card details from the AEM GraphQL API for a given content fragment path.
 * @param {string} cfPath The path to the content fragment.
 * @returns {Promise<object|null>} The credit card details or null if not found.
 */
async function getCreditCardDetails(cfPath) {
  if (!cfPath) {
    console.error('Content fragment path is missing.');
    return null;
  }
  const url = `${API_ENDPOINT};path=${cfPath}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data?.data?.creditCardContainerByPath?.item || null;
  } catch (error) {
    console.error(`Error fetching data for ${cfPath}:`, error);
    return null;
  }
}

/**
 * Decorates the block with fetched credit card details.
 * @param {HTMLElement} block The block element.
 */
export default async function decorate(block) {
  // Clear the block's content before processing.
  block.innerHTML = '';
  const ul = document.createElement('ul');

  // Find all content fragment link elements.
  const cfLinks = [...block.querySelectorAll('a[title^="/content/dam"]')];

  // Fetch details for all content fragments concurrently.
  const promises = cfLinks.map(link => getCreditCardDetails(link.title));
  const detailsArray = await Promise.all(promises);

  // Render the list items from the fetched data.
  detailsArray.forEach(details => {
    if (details) {
      const li = document.createElement('li');
      // Create and append the content for each card.
      li.innerHTML = `<h3>${details.name}</h3><p>${details.description.html}</p>`;
      ul.appendChild(li);
    }
  });

  block.appendChild(ul);
}

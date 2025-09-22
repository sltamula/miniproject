const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

async function getContentFragmentDetails(cfPath) {
  if (!cfPath) {
    console.error('Content fragment path not found.');
    return null;
  }

  const url = `${API_ENDPOINT};path=${cfPath}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cfData = await response.json();
    const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

    if (!ccDetails) {
      console.error('No credit card details found in content fragment.');
    }
    return ccDetails;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default async function decorate(block) {
  const children = [...block.children];

  // Map each child to a Promise that fetches content fragment details.
  const promises = children.map(row => {
    const cfPath = row.querySelector('a')?.title;
    return getContentFragmentDetails(cfPath);
  });

  // Await all promises to resolve concurrently.
  const detailsArray = await Promise.all(promises);

  const ul = document.createElement('ul');

  // Filter out any null values and map the results to <li> elements.
  detailsArray
    .filter(details => details)
    .forEach(details => {
      const li = document.createElement('li');
      li.textContent = details.name;
      ul.append(li);
    });

  // Clear existing content and append the new list.
  block.textContent = '';
  block.append(ul);
}

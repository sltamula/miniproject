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
  }
}

export default async function decorate(block) {
  const children = [...block.children];

  // Map each child to a Promise that fetches content fragment details.
  const promises = children.map(row => {
    const cfPath = row.querySelector('a')?.title;
    return getContentFragmentDetails(cfPath);
  });
}

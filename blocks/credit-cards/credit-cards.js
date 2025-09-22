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

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  const children = [...block.children];
  children.forEach(row => {
    const cfPath = children[0].querySelector('a')?.title;
    getContentFragmentDetails(cfPath);
  });
  block.textContent = '';
  block.append(ul);
}

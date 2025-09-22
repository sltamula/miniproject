function renderContent(block, ccDetails) {
  return null;
}

async function getContentFragmentDetails(cfPath, block) {
  let url;
  const API_ENDPOINT =
    'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

  if (cfPath !== null && cfPath !== '') {
    url = `${API_ENDPOINT};path=${cfPath}`;
  } else {
    console.error('Content fragment path not found.');
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cfData = await response.json();
    const ccDetails = cfData?.data?.creditCardContainerByPath?.item;

    if (ccDetails) {
      renderContent(block, ccDetails);
    } else {
      console.error('No credit card details found in content fragment.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  const children = [...block.children];
  children.forEach(row => {
    const cfPath = children[0].querySelector('a')?.title;
    getContentFragmentDetails(cfPath, block);
  });
  block.textContent = '';
  block.append(ul);
}

const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

// This function gets the credit card details from an AEM content fragment.
// It's like a messenger that goes to a specific address to grab some information.
async function getCreditCardData(fragmentPath) {
  // If there's no address, we can't go anywhere.
  if (!fragmentPath) {
    console.error('No content fragment address was provided.');
    return null;
  }

  // Build the full address to the data.
  const fullURL = `${API_ENDPOINT};path=${fragmentPath}`;

  try {
    // Go to the address and get the information.
    const response = await fetch(fullURL);

    // If the trip failed, let us know.
    if (!response.ok) {
      throw new Error(`The trip failed! Status: ${response.status}`);
    }

    // Convert the information into a format we can read.
    const rawData = await response.json();

    // Find the specific details we need inside the information.
    const creditCardDetails = rawData?.data?.creditCardContainerByPath?.item;

    // If we didn't find the details, let us know.
    if (!creditCardDetails) {
      console.error('The specific credit card details were not found.');
    }

    // Give the details back so we can use them.
    return creditCardDetails;
  } catch (error) {
    // If something went wrong during the trip, tell us why.
    console.error('An error happened while getting the data:', error);
    return null;
  }
}

// This is the main function that builds the content on the webpage.
// It acts like a builder using the information the messenger brings back.
export default async function decorate(block) {
  // Find all the starting pieces of information on the page.
  const allInitialItems = [...block.children];

  // Ask the messenger to get the data for each item at the same time.
  // We get a list of "promises" to get the data later.
  const dataPromises = allInitialItems.map(item => {
    // Find the address from the link in each item.
    const fragmentPath = item.querySelector('a')?.title;
    // Ask the messenger to go get the data.
    return getCreditCardData(fragmentPath);
  });

  // Wait for all the messengers to come back with their information.
  // This step makes sure we have all the data before we start building.
  const allCardDetails = await Promise.all(dataPromises);

  // Prepare a list to display the items.
  const myList = document.createElement('ul');

  // Go through the list of all the information we got back.
  allCardDetails
    .filter(details => details) // Get rid of any items that didn't have details.
    .forEach(details => {
      // For each item with details, create a new list item.
      const listItem = document.createElement('li');
      // Set the text of the list item to the name from the details.
      listItem.textContent = details.name;
      // Add the new list item to our main list.
      myList.append(listItem);
    });

  // Clear out the old content on the page.
  block.textContent = '';
  // Put our new list with all the items onto the page.
  block.append(myList);
}

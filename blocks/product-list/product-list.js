const API_ENDPOINT =
  'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject/getCreditCardDetails';

export default async function decorate(block) {
  // Extract the content fragment path from the first child's link title.
  const contentFragmentPath =
    block.firstElementChild?.querySelector('a')?.title;

  // Handle cases where no valid content fragment path is found.
  if (!contentFragmentPath) {
    console.log('Block does not contain a valid content fragment path.');
    return;
  }

  // Construct the full API URL for the GraphQL query.
  const graphqlUrl = `${API_ENDPOINT};path=${contentFragmentPath}`;

  try {
    const response = await fetch(graphqlUrl);

    if (!response.ok) {
      // Throw a more informative error message.
      throw new Error(
        `HTTP Error: ${response.status} - Failed to fetch data from ${graphqlUrl}`
      );
    }

    // You would typically process the fetched data here.
    const data = await response.json();
    // For now, log the fetched data to avoid unused variable error.
    console.log('Fetched data:', data);
  } catch (error) {
    // Handle error appropriately (e.g., display to user, send to logging service)
    // Optionally, you can throw the error or handle it as needed:
    // throw error;
  }
}

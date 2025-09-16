export default async function decorate(block) {
  const fragmentPath = block.textContent.trim();

  // Correct: Construct the full URL for the persisted query, including variables.
  const url = `https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/miniproject-site/getCreditCardDetails;path=${encodeURIComponent(
    fragmentPath
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data.data.creditCardContainerByPath.item; // Access data based on the response structure
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // or throw an error
  }
}

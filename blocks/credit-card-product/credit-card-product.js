import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default async function decorate(block) {
  const fragmentPath = block.textContent.trim();

  // Correct: Set the URI to the base GraphQL endpoint.
  // Apollo will send the query and variables in the POST request body.
  const client = new ApolloClient({
    uri: 'https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json',
    cache: new InMemoryCache(),
  });

  const GET_CREDIT_CARD = gql`
    query GetCreditCardContainerByPath($path: String!) {
      creditCardContainerByPath(_path: $path) {
        item {
          name
        }
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: GET_CREDIT_CARD,
      variables: { path: fragmentPath },
    });
    console.log(data);
    return data.creditCardContainerByPath.item;
  } catch (error) {
    console.error('Error fetching data with Apollo:', error);
    return null; // or throw an error
  }
}

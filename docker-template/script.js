const graphqlEndpoint = 'http://localhost:8080/v1/graphql';
//const fetch = require('node-fetch');
const query = `
  query GetTestTable {
  Test_Table {
    id
    test
  }
}
`;

fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({ query }),
})
    .then(response => response.json())
    .then(data => {
        // Handle the GraphQL response
        console.log(data);
    })
    .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
    });

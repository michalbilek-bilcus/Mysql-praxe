const http = require('http');


const hostname = '127.0.0.1';
const port = 3000;
const hasuraAdminSecret = 'myadminsecretkey';

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');

    const graphqlEndpoint = 'http://localhost:8080/v1/graphql';
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
            'x-hasura-admin-secret': hasuraAdminSecret,
        },
        body: JSON.stringify({ query }),
    })
        .then(response => response.json())
        .then(data => {
            //práce s databází
            const results = data.data.Test_Table;
            let output = '<h4>Data:</h4>';

            for (let i = 0; i < results.length; i++) {
                output += `<p>ID: ${results[i].id}</p>`;
                output += `<p>Test: ${results[i].test}</p>`;
            }
            response.end(output);
        })
        .catch(error => {
            console.error('Error:', error);
            response.end('An error occurred.');
        });
});

// Odkaz na server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

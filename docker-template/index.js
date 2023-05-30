const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;
const hasuraAdminSecret = 'myadminsecretkey';

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');

    const graphqlEndpoint = 'http://mysql-graphql-engine-1+:8080/v1/graphql';
    const query = `
        query GetTestTable {
            Test_Table {
                id
                test
            }
        }
    `;

    const mutation = `
        mutation CreateTestEntry($id: Int!, $test: Int!) {
            insert_Test_Table(objects: {id: $id, test: $test}) {
                affected_rows
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
                output += `<div class="data">`;
                output += `<p class="text">ID: ${results[i].id}</p>`;
                output += `<p class="text">TEST: ${results[i].test}</p>`;
                output += `</div>`;
            }

            // Proveď mutaci pro vytvoření nového záznamu
            fetch(graphqlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-hasura-admin-secret': hasuraAdminSecret,
                },
                body: JSON.stringify({
                    query: mutation,
                    variables: {
                        id: 100,
                        test: 100,
                    },
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Zpracování odpovědi z mutace
                    //console.log('Mutation result:', data);

                    response.end(`
                        <html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f5f5f5;
                                        padding: 20px;
                                    }
                                    
                                    h4 {
                                        margin-bottom: 10px;
                                    }
                                    
                                    .data {
                                        background-color: white;
                                        border-radius: 5px;
                                        padding: 10px;
                                        margin-bottom: 10px;
                                    }
                                    
                                    .text {
                                        margin: 5px 0;
                                    }
                                </style>
                            </head>
                            <body>
                                ${output}
                            </body>
                        </html>
                    `);
                })
                .catch(error => {
                    console.error('Mutation error:', error);
                    response.end('An error occurred.');
                });
        })
        .catch(error => {
            console.error('Query error:', error);
            response.end('An error occurred.');
        });
});

// Odkaz na server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
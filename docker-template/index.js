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
            zkouska {
                id
                cotoje
                jetopravda
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
            const results = data.data.zkouska;
            let output = '<h4>Data:</h4>';

            for (let i = 0; i < results.length; i++) {
                output += `<div class="data">`;
                output += `<p class="text">ID: ${results[i].id}</p>`;
                output += `<p class="text">cotoje: ${results[i].cotoje}</p>`;
                output += `<p class="text">jetopravda: ${results[i].jetopravda}</p>`;
                output += `</div>`;
            }

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
            console.error('Error:', error);
            response.end('An error occurred.');
        });
});

// Odkaz na server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

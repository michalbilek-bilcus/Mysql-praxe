async function getDataFromHasura() {
    try {
        const response = await fetch('http://localhost:8080/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': 'myadminsecretkey',
            },
            body: JSON.stringify({
                query: `
          mutation {
            update_Test_Table_by_pk(
              pk_columns: { id: 4 }
              _set: { test: 5552825 }
            ) {
              id
              test
            }
          }
        `,
            }),
        });

        const data = await response.json();
        console.log('Updated Test_Table row:', data.data.update_Test_Table_by_pk);
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

getDataFromHasura();

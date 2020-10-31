import feathers from '@feathersjs/client';
import { restClient, authClient } from 'ra-data-feathers';

//@ts-ignore
const app = feathers();

// Connect to a different URL
const client = feathers.rest('http://localhost:3030');

// app.configure(feathers.hooks())

// Configure an AJAX library (see below) with that client
app.configure(client.fetch(window.fetch));

// Use localStorage to store our login token
app.configure(
    feathers.authentication({
        storage: window.localStorage,
        jwtStrategy: 'jwt',
    })
);

export { authClient, restClient };
export default app;

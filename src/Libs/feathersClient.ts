import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import auth from '@feathersjs/authentication-client';
import { restClient, authClient } from 'ra-data-feathers';

const app = feathers();

// Connect to a different URL
const client = rest('http://localhost:3030');

// app.configure(feathers.hooks())

// Configure an AJAX library (see below) with that client
app.configure(client.fetch(window.fetch));

// Use localStorage to store our login token
app.configure(
    auth({
        storage: window.localStorage,
        jwtStrategy: 'jwt',
    })
);

export { authClient, restClient };
export default app;

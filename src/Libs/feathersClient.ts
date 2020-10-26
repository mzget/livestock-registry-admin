import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';

//@ts-ignore
const app = feathers();

// Connect to a different URL
const restClient = rest('http://localhost:3030');

// Configure an AJAX library (see below) with that client
app.configure(restClient.fetch(window.fetch));
// Use localStorage to store our login token
app.configure(
    feathers.authentication({
        storage: window.localStorage,
    })
);

// Connect to the `http://feathers-api.com/messages` service
const users = app.service('users');

export default app;

import { Admin, Resource, ListGuesser } from 'react-admin';
import { restClient, authClient } from 'ra-data-feathers';

import feathersClient from 'libs/feathersClient';

import UsersList from 'resources/UsersList';

import './App.css';

const restClientOptions = {
    id: '_id', // In this example, the database uses '_id' rather than 'id'
    usePatch: true, // Use PATCH instead of PUT for updates
};
const authClientOptions = {
    storageKey: 'feathers-jwt',
    authenticate: {
        // Options included in calls to Feathers client.authenticate
        strategy: 'local', // The authentication strategy Feathers should use
    },
    passwordField: 'password', // The key used to provide the password to Feathers client.authenticate
    usernameField: 'email', // The key used to provide the username to Feathers client.authenticate
};

const App = () => (
    <Admin
        dataProvider={restClient(feathersClient, restClientOptions)}
        authProvider={authClient(feathersClient, authClientOptions)}
    >
        <Resource name="users" list={UsersList} />
    </Admin>
);

export default App;

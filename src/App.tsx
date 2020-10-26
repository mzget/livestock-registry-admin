import { Admin, Resource, ListGuesser } from 'react-admin';
import { restClient, authClient } from 'ra-data-feathers';

import feathersClient from 'libs/feathersClient';

import './App.css';

const restClientOptions = {
    id: '_id', // In this example, the database uses '_id' rather than 'id'
    usePatch: true, // Use PATCH instead of PUT for updates
};
const authClientOptions = {
    storageKey: 'token', // The key in localStorage used to store the authentication token
    authenticate: {
        // Options included in calls to Feathers client.authenticate
        strategy: 'local', // The authentication strategy Feathers should use
    },
    permissionsKey: 'permissions', // The key in localStorage used to store permissions from decoded JWT
    permissionsField: 'roles', // The key in the decoded JWT containing the user's role
    passwordField: 'password', // The key used to provide the password to Feathers client.authenticate
    usernameField: 'email', // The key used to provide the username to Feathers client.authenticate
    redirectTo: '/login', // Redirect to this path if an AUTH_CHECK fails. Uses the react-admin default of '/login' if omitted.
    logoutOnForbidden: false, // Logout when response status code is 403
};

const App = () => (
    <Admin
        dataProvider={restClient(feathersClient, restClientOptions)}
        authProvider={authClient(feathersClient, authClientOptions)}
    >
        <Resource name="users" list={ListGuesser} />
    </Admin>
);

export default App;

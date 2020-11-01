import { Admin, Resource } from 'react-admin';
import feathersClient, { restClient, authClient } from 'libs/feathersClient';

import UsersList from 'resources/users/UsersList';
import UserEdit from 'resources/users/UserEdit';

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

const dataProvider = restClient(feathersClient, restClientOptions);
const overrideRestClient = {
    ...dataProvider,
    update: (resource, params) => {
        console.log('test', resource, params);
        if (resource !== 'posts' || !params.data.pictures) {
            // fallback to the default implementation
            return dataProvider.update(resource, params);
        }
        return dataProvider.update(resource, params);
    },
};

const App = () => (
    <Admin
        dataProvider={overrideRestClient}
        authProvider={authClient(feathersClient, authClientOptions)}
    >
        <Resource name="users" list={UsersList} edit={UserEdit} />
    </Admin>
);

export default App;

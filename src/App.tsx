import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { restClient, authClient } from 'ra-data-feathers';

import feathersClient from 'libs/feathersClient';

import './App.css';

const restClientOptions = {
    id: '_id', // In this example, the database uses '_id' rather than 'id'
    usePatch: true, // Use PATCH instead of PUT for updates
};

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const App = () => (
    <Admin dataProvider={restClient(feathersClient, restClientOptions)}>
        <Resource name="users" list={ListGuesser} />
    </Admin>
);

export default App;

import { Admin, Resource } from 'react-admin';
import feathersClient, { restClient, authClient } from 'libs/feathersClient';

import UsersList from 'resources/users/UsersList';
import UserEdit from 'resources/users/UserEdit';

import './App.css';
import { convertFileToBase64 } from 'helpers/convertFileToBase64';
import fileReducer from './reducers/fileReducer';
import { useMemo } from 'react';

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

const App = () => {
    const overrideRestClient = useMemo(
        () => ({
            ...dataProvider,
            update: (resource, params) => {
                console.log('test', resource, params);
                if (resource !== 'posts' || !params.data.images) {
                    // fallback to the default implementation
                    return dataProvider.update(resource, params);
                }

                /**
                 * For posts update only, convert uploaded image in base 64 and attach it to
                 * the `picture` sent property, with `src` and `title` attributes.
                 */

                // Freshly dropped pictures are File objects and must be converted to base64 strings
                const newPictures = params.ssss.images.filter(
                    (p) => p.rawFile instanceof File
                );
                const formerPictures = params.data.images.filter(
                    (p) => !(p.rawFile instanceof File)
                );

                return Promise.all(newPictures.map(convertFileToBase64))
                    .then((base64Pictures) =>
                        base64Pictures.map((picture64) => ({
                            src: picture64,
                            title: `${params.data.title}`,
                        }))
                    )
                    .then((transformedNewPictures) =>
                        dataProvider.update(resource, {
                            ...params,
                            data: {
                                ...params.data,
                                images: [
                                    ...transformedNewPictures,
                                    ...formerPictures,
                                ],
                            },
                        })
                    );
            },
        }),
        []
    );

    return (
        <Admin
            dataProvider={overrideRestClient}
            authProvider={authClient(feathersClient, authClientOptions)}
            customReducers={{ fileUpload: fileReducer }}
        >
            <Resource name="users" list={UsersList} edit={UserEdit} />
        </Admin>
    );
};

export default App;

import { Application } from '@feathersjs/feathers';
import { GetListParams, GetOneParams } from 'react-admin';

type ClientOptions = {
    id?: string;
    usePatch?: boolean;
};

const defaultIdKey = 'id';
function getIdKey({
    resource,
    options,
}: {
    resource: string;
    options: ClientOptions;
}) {
    return (
        (options[resource] && options[resource].id) ||
        options.id ||
        defaultIdKey
    );
}
function deleteProp(obj: any, prop: string) {
    const res = Object.assign({}, obj);
    delete res[prop];
    return res;
}

const getList = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetListParams
) => {
    console.log(resource, params);
    return Promise.reject();
};
const getOne = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetOneParams
) => {
    const idKey = getIdKey({ resource, options });
    const service = client.service(resource);

    const restParams = deleteProp(params, defaultIdKey);
    return service.get(params.id, restParams).then((response) => ({
        data: { ...response, id: response[idKey] },
        validUntil: undefined,
    }));
};

function restClient(client: Application, options: ClientOptions = {}) {
    return {
        getList: getList(client, options),
        getOne: getOne(client, options),
        getMany: (resource, params): Promise<any> =>
            Promise.resolve({ data: [{}], validUntil: {} }),
        getManyReference: (resource, params): Promise<any> =>
            Promise.resolve({ data: [{}], total: 0 }),
        create: (resource, params): Promise<any> =>
            Promise.resolve({ data: {} }),
        update: (resource, params): Promise<any> =>
            Promise.resolve({ data: {} }),
        updateMany: (resource, params): Promise<any> =>
            Promise.resolve({ data: [{}] }),
        delete: (resource, params): Promise<any> =>
            Promise.resolve({ data: {} }),
        deleteMany: (resource, params): Promise<any> =>
            Promise.resolve({ data: [{}] }),
    };
}
export default restClient;

import { Application } from '@feathersjs/feathers';
import {
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
} from 'react-admin';

import { getListRequest } from './mapResquest';
import { mapGetResponse } from './mapResponse';
import { defaultIdKey, dbg, queryOperators } from './helper';

type ClientOptions = {
    id?: string; // If your database uses an id field other than 'id'. Optional.
    usePatch?: boolean; // Use PATCH instead of PUT for UPDATE requests. Optional.
    my_resource?: {
        // Options for individual resources can be set by adding an object with the same name. Optional.
        id: string; // If this specific table uses an id field other than 'id'. Optional.
    };
    /* Allows to use custom query operators from various feathers-database-adapters in GET_MANY calls.
     * Will be merged with the default query operators ['$gt', '$gte', '$lt', '$lte', '$ne', '$sort', '$or', '$nin', '$in']
     */
    customQueryOperators?: Array<any>;
};

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
function initFunction({ client, options, resource, params }) {
    const idKey = getIdKey({ resource, options });
    dbg('resource=%o, params=%o, idKey=%o', resource, params, idKey);
    const service = client.service(resource);
    const query: any = {};

    return { idKey, service, query };
}

/**
 * DataProvider Interface
 */

const getList = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetListParams
): Promise<GetListResult<any>> => {
    const init = initFunction({
        client,
        options,
        resource,
        params,
    });

    return getListRequest({ options, params }, init);
};
const getOne = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetOneParams
): Promise<GetOneResult<any>> => {
    const idKey = getIdKey({ resource, options });
    const service = client.service(resource);

    const restParams = deleteProp(params, defaultIdKey);
    return service.get(params.id, restParams).then((response) => ({
        data: { ...response, id: response[idKey] },
        validUntil: undefined,
    }));
};
const getMany = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetManyParams
): Promise<GetManyResult<any>> => {
    const { query, service, idKey } = initFunction({
        client,
        options,
        resource,
        params,
    });

    const ids = params.ids || [];
    query[idKey] = { $in: ids };
    query.$limit = ids.length;
    return service
        .find({ query })
        .then((response) => mapGetResponse(response, idKey));
};
const getManyReference = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetManyReferenceParams
): Promise<GetManyReferenceResult<any>> => {
    const { query, service, idKey } = initFunction({
        client,
        options,
        resource,
        params,
    });

    if (params.target && params.id) {
        query[params.target] = params.id;
    }
    return getListRequest({ options, params }, { query, service, idKey });
};

/**
 * React-Admin version 3 new dataProvider interface
 * @param client
 * @param options
 */
function restClient(client: Application, options: ClientOptions = {}) {
    return {
        getList: getList(client, options),
        getOne: getOne(client, options),
        getMany: getMany(client, options),
        getManyReference: getManyReference(client, options),
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

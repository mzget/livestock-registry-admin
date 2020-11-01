import { Application } from '@feathersjs/feathers';
import {
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyResult,
    GetOneParams,
    GetOneResult,
} from 'react-admin';

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

const debug = console.info;
const dbg = (...msgs) => debug('ra-data-feathers:rest-client', ...msgs);
const queryOperators = [
    '$gt',
    '$gte',
    '$lt',
    '$lte',
    '$ne',
    '$sort',
    '$or',
    '$nin',
    '$in',
];
const defaultIdKey = 'id';
function flatten(object, prefix = '', stopKeys: Array<any> = []) {
    return Object.keys(object).reduce((prev, element) => {
        const hasNextLevel =
            object[element] &&
            typeof object[element] === 'object' &&
            !Array.isArray(object[element]) &&
            !Object.keys(object[element]).some((key) => stopKeys.includes(key));
        return hasNextLevel
            ? {
                  ...prev,
                  ...flatten(object[element], `${prefix}${element}.`, stopKeys),
              }
            : { ...prev, ...{ [`${prefix}${element}`]: object[element] } };
    }, {});
}
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
 * Map Response
 */
function mapGetResponse(response, idKey) {
    let res;
    // support paginated and non paginated services
    if (!response.data) {
        response.total = response.length;
        res = response;
    } else {
        res = response.data;
    }
    response.data = res.map((_item) => {
        const item = _item;
        if (idKey !== defaultIdKey) {
            item.id = _item[idKey];
        }
        return _item;
    });
    return { ...response, validUntil: undefined };
}

/**
 * DataProvider Interface
 */

const getList = (client: Application, options: ClientOptions) => (
    resource: string,
    params: GetListParams
): Promise<GetListResult<any>> => {
    const { query, service, idKey } = initFunction({
        client,
        options,
        resource,
        params,
    });

    const { page, perPage } = params.pagination || {};
    const { field, order } = params.sort || {};
    const additionalQueryOperators = options.customQueryOperators ?? [];
    const allUniqueQueryOperators = [
        ...new Set(queryOperators.concat(additionalQueryOperators)),
    ];
    dbg('field=%o, order=%o', field, order);
    if (perPage && page) {
        query.$limit = perPage;
        query.$skip = perPage * (page - 1);
    }
    if (order) {
        query.$sort = {
            [field === defaultIdKey ? idKey : field]: order === 'DESC' ? -1 : 1,
        };
    }
    Object.assign(
        query,
        params.filter ? flatten(params.filter, '', allUniqueQueryOperators) : {}
    );
    dbg('query=%o', query);
    return service
        .find({ query })
        .then((response) => mapGetResponse(response, idKey));
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

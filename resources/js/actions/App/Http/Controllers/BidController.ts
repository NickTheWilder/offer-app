import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BidController::store
* @see app/Http/Controllers/BidController.php:16
* @route '/auction-items/{id}/bids'
*/
export const store = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/auction-items/{id}/bids',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BidController::store
* @see app/Http/Controllers/BidController.php:16
* @route '/auction-items/{id}/bids'
*/
store.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return store.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BidController::store
* @see app/Http/Controllers/BidController.php:16
* @route '/auction-items/{id}/bids'
*/
store.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BidController::store
* @see app/Http/Controllers/BidController.php:16
* @route '/auction-items/{id}/bids'
*/
const storeForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BidController::store
* @see app/Http/Controllers/BidController.php:16
* @route '/auction-items/{id}/bids'
*/
storeForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
export const index = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/auction-items/{id}/bids',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
index.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return index.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
index.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
index.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
const indexForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
indexForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BidController::index
* @see app/Http/Controllers/BidController.php:77
* @route '/auction-items/{id}/bids'
*/
indexForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
export const userBids = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userBids.url(options),
    method: 'get',
})

userBids.definition = {
    methods: ["get","head"],
    url: '/api/user/bids',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
userBids.url = (options?: RouteQueryOptions) => {
    return userBids.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
userBids.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userBids.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
userBids.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userBids.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
const userBidsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userBids.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
userBidsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userBids.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BidController::userBids
* @see app/Http/Controllers/BidController.php:96
* @route '/api/user/bids'
*/
userBidsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userBids.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userBids.form = userBidsForm

const BidController = { store, index, userBids }

export default BidController
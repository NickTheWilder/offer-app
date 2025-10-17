import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from "./../wayfinder";
/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
    url: login.url(options),
    method: "get",
});

login.definition = {
    methods: ["get", "head"],
    url: "/login",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
    url: login.url(options),
    method: "get",
});

/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
    url: login.url(options),
    method: "head",
});

/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: login.url(options),
    method: "get",
});

/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: login.url(options),
    method: "get",
});

/**
 * @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:17
 * @route '/login'
 */
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: login.url({
        [options?.mergeQuery ? "mergeQuery" : "query"]: {
            _method: "HEAD",
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: "get",
});

login.form = loginForm;

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
    url: register.url(options),
    method: "get",
});

register.definition = {
    methods: ["get", "head"],
    url: "/register",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
    url: register.url(options),
    method: "get",
});

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
    url: register.url(options),
    method: "head",
});

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: register.url(options),
    method: "get",
});

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: register.url(options),
    method: "get",
});

/**
 * @see \App\Http\Controllers\AuthController::register
 * @see app/Http/Controllers/AuthController.php:46
 * @route '/register'
 */
registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: register.url({
        [options?.mergeQuery ? "mergeQuery" : "query"]: {
            _method: "HEAD",
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: "get",
});

register.form = registerForm;

/**
 * @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:97
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
    url: logout.url(options),
    method: "post",
});

logout.definition = {
    methods: ["post"],
    url: "/logout",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:97
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:97
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
    url: logout.url(options),
    method: "post",
});

/**
 * @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:97
 * @route '/logout'
 */
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<"post"> => ({
    action: logout.url(options),
    method: "post",
});

/**
 * @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:97
 * @route '/logout'
 */
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<"post"> => ({
    action: logout.url(options),
    method: "post",
});

logout.form = logoutForm;

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
export const admin = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
    url: admin.url(options),
    method: "get",
});

admin.definition = {
    methods: ["get", "head"],
    url: "/admin",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
admin.url = (options?: RouteQueryOptions) => {
    return admin.definition.url + queryParams(options);
};

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
admin.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
    url: admin.url(options),
    method: "get",
});

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
admin.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
    url: admin.url(options),
    method: "head",
});

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
const adminForm = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: admin.url(options),
    method: "get",
});

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
adminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: admin.url(options),
    method: "get",
});

/**
 * @see routes/web.php:58
 * @route '/admin'
 */
adminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
    action: admin.url({
        [options?.mergeQuery ? "mergeQuery" : "query"]: {
            _method: "HEAD",
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: "get",
});

admin.form = adminForm;

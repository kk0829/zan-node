const PREFIX = '$$route';
const exportMethod = {};

// define absolute url
exportMethod.full = {};

const throwError = (msg) => {
    throw new Error(msg);
};

const getFullTag = isFull => (isFull ? 'F' : '');

function destruct(args) {
    const hasPath = typeof args[0] === 'string';
    const path = hasPath ? args[0] : '';
    const middleware = hasPath ? args.slice(1) : args;

    if (middleware.some(m => typeof m !== 'function')) {
        throwError('Middleware must be function');
    }

    return [path, middleware];
}

// @route(method, path: optional, ...middleware: optional)
function route(method, isFull, ...args) {
    if (typeof method !== 'string') {
        throwError('The first argument must be an HTTP method');
    }

    const [path, middleware] = destruct(args);

    return (target, name) => {
        const key = `${PREFIX}_${getFullTag(isFull)}_${name}`;
        if (!target[key]) {
            target[key] = [];
        }
        target[key].push({ key, method, path, middleware });
    };
}

// @[method](...args) === @route(method, ...args)
const methods = ['get', 'post', 'put', 'patch', 'delete'];

methods.forEach((method) => {
    exportMethod[method] = route.bind(null, method, false);
    exportMethod.full[method] = route.bind(null, method, true);
});

function baseAuto(target, name, descriptor, isFull) {
    // parse key
    const keyChips = name.split(/(?=[A-Z])/).map(x => x.toLowerCase());
    if (methods.indexOf(keyChips[0]) > -1) {
        const method = keyChips[0];
        const tail = keyChips[keyChips.length - 1];

        if (tail !== 'html' && tail !== 'json') {
            throwError(`method ${name} should end with Html or Json`);
        }
        if (keyChips.length < 3) {
            throwError('method body is not right');
        }
        if (keyChips.length === 3 && keyChips[1] === 'index') keyChips[1] = '';

        const path = `/${keyChips.slice(1, keyChips.length - 1).join(isFull ? '/' : '-')}`;
        const key = `${PREFIX}_${getFullTag(isFull)}_${name}`;
        if (!target[key]) {
            target[key] = [];
        }
        target[key].push({ key, method, path, middleware: [] });
    } else {
        throwError(`method ${name} cannot match any legal word, please use follwing words: ${methods}`);
    }
}

const auto     = (...args) => baseAuto(...args, false);
const fullAuto = (...args) => baseAuto(...args, true);

// @controller(path: optional, ...middleware: optional)
function controller(...args) {
    const [ctrlPath, ctrlMiddleware] = destruct(args);

    return (target) => {
        const proto = target.prototype;
        proto.$routes = Object.getOwnPropertyNames(proto)
            .filter(prop => prop.indexOf(PREFIX) === 0)
            .map(prop => proto[prop])
            .reduce((prev, next) => prev.concat(next), [])
            .map((prop) => {
                const { key, method, path, middleware: actionMiddleware } = prop;
                const middleware = ctrlMiddleware.concat(actionMiddleware);
                const [, isFull, fnName] = key.split('_');
                const url = `${isFull ? '' : ctrlPath}${path}`.replace(/\/\//g, '/');
                return { method, url, middleware, fnName };
            });
    };
}

exportMethod.auto = auto;
exportMethod.controller = controller;
exportMethod.full.auto = fullAuto;

export default exportMethod;

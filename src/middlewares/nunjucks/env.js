import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';

let BASE_PATH = process.env.NODE_ENV === 'development' ?
    path.join(process.cwd(), 'server') :
    path.join(process.cwd(), 'server_dist');

let VIEW_PATH = [];
if (fs.existsSync(path.join(BASE_PATH, 'views'))) {
    VIEW_PATH.push(path.join(BASE_PATH, 'views'));
}
if (fs.existsSync(path.join(BASE_PATH, 'src'))) {
    VIEW_PATH.push(path.join(BASE_PATH, 'src'));
}

let env = nunjucks.configure(VIEW_PATH, {
    autoescape: true
});

export default env;
import path from 'path';
import nunjucks from 'nunjucks';

let VIEW_PATH = process.env.NODE_ENV === 'development' ?
    path.join(process.cwd(), 'server/views') :
    path.join(process.cwd(), 'server_dist/views');

let env = nunjucks.configure(VIEW_PATH, {
    autoescape: true
});

export default env;

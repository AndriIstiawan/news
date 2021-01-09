/* building a mongodb URI string based on configs read from .env file
*/

const dbConnBuilder = (config) => {
    const stringUri = [];
    stringUri.push(config.db_dialect);
    if (config.db_user && config.db_pass) {
        stringUri.push('://', config.db_user, ':', config.db_pass, '@');
    } else {
        stringUri.push('://')
    }
    stringUri.push(config.db_host);
    if (config.db_port) {
        stringUri.push(':', config.db_port);
    }
    stringUri.push('/', config.db_name);
    if (config.db_options) {
        stringUri.push('?', config.db_options);
    }

    return stringUri.join("");
}


module.exports = dbConnBuilder;

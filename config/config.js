// config/config.js

require('dotenv').config(); // instantiate env variables

const CONFIG = {
    app: process.env.APP,          // 'dev';
    port: process.env.PORT,        // 4000;

    ip_address: process.env.IP_ADDRESS, // 'http://localhost:4000';
    db_dialect: process.env.DB_DIALECT, // 'mongodb';
    db_user: process.env.DB_USER,       // 'user'
    db_pass: process.env.DB_PASS,       // 'user123'
    db_host: process.env.DB_HOST,       // 'localhost';
    db_port: process.env.DB_PORT,       // '27017';
    db_name: process.env.DB_NAME,       // 'platform-backend-dev';
    db_options: process.env.DB_OPTIONS, // 'retryWrites=true&w=majority'

    jwt_encryption_key: process.env.JWT_ENCRYPTION_KEY, // 'secret_key';
    jwt_expiration: process.env.JWT_EXPIRATION,         // '3600';

    ip_address_frontend: process.env.IP_ADDRESS_FRONTEND, // 'http://localhost:4000';

    user_smtp: process.env.USER_SMTP, //|| 'apikey';
    port_smtp: process.env.PORT_SMTP, //|| '465';
    pass_smtp: process.env.PASS_AMTP, //|| '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';

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    URL_S3: process.env.URL_S3,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET
}; // Make a global CONFIG object to be used all over the app

module.exports = CONFIG;

'use strict';

module.exports = {
    PORT: process.env.PORT || 8080,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb+srv://jordan:haddadi@roadrate-qquzy.mongodb.net/roadrate?retryWrites=true&w=majority',
    TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://localhost/test-trisha-slack-clone',
    JWT_SECRET: process.env.JWT_SECRET || 'trisha-secret-key',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};

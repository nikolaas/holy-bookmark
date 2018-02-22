export default {
    // application server port
    port: 8080,

    // security module configuration
    security: {
        jwt: {
            secret: undefined,
            issuer: 'holybookmark.heroku.com',
        },

        // unauthorized request configuration
        unauthorizedRequest: {
            allowRedirect: false,
            // Define path for redirecting unauthorized request. If not defined respond for request will be 401
            redirect: '/'
        }
    },
    database: {
        type: undefined,
        url: undefined,
    }
};

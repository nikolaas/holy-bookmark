export default {
    // application port
    port: 8080,
    bodyLimit: "100kb",
    corsHeaders: ["Link"],

    // security module configuration
    security: {
        jwt: {
            secret: undefined, // defined in external config file
            issuer: 'accounts.examplesoft.com',
            audience: 'yoursite.net',
        },

        // unauthorized request configuration
        unauthorizedRequest: {
            allowRedirect: false,
            // Define path for redirecting unauthorized request. If not defined respond for request will be 401
            redirect: '/'
        }
    },
};

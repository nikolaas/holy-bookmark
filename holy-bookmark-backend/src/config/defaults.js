export default {
    // application port
    port: 8080,
    bodyLimit: "100kb",
    corsHeaders: ["Link"],

    // security module configuration
    security: {
        // security strategy configuration
        strategy: {
            // security strategy name. At this time it supported only "local" strategy
            name: "local",
            // Define request body field that contains user name for authentication
            usernameField: "username",
            // Define request body field that contains user password for authentication
            passwordField: "password"
        },
        // unauthorized request configuration
        // unauthorizedRequest: {
        //     // Define path for redirecting unauthorized request. If not defined respond for request will be 401
        //     redirect: '/'
        // }
    },
};

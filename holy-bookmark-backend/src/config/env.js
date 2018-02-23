export default {
    port: process.env.PORT,
    host: process.env.HOST,
    security: {
        jwt: {
            secret: process.env.SECURITY_JWT_SECRET,
            issuer: process.env.SECURITY_JWT_ISSUER,
        }
    },
    database: {
        type: process.env.DATABASE_TYPE,
        url: process.env.DATABASE_URL,
    }
};

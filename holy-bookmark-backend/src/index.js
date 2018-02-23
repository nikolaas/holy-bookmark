import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from './config';
import { initializeDb } from './core/db';
import { loadModules } from './core/modules';
import security from './modules/security';
import links from './modules/links';

const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	credentials: true,
	origin: [
		/^(http|https):\/\/localhost:8080/,
		/^chrome-extension:\/\/.*/,
	],
    methods: 'GET, POST, PATCH, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    exposedHeaders: 'Content-Type, Authorization'
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connect to db
initializeDb()
	.then(() => {
		return loadModules(app, [security, links]);
	})
	.then(() => {
		app.server.listen(config.get('port'), config.get('host'), () => {
            const host = app.server.address().address;
            const port = app.server.address().port;
            console.log('Web server started at http://%s:%s', host, port);
		});
	});

export default app;

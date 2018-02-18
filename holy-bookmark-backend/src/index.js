import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from './config';
import security from './modules/security';
import { initializeDb } from './core/db-initializer';
import { ModuleLoader } from './core/module-loader';
import api from './api';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	credentials: true,
	// origin: 'http://localhost:8080',
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
initializeDb( db => {
	const moduleLoader = new ModuleLoader(app, config, db);

	const modules = [
		security,
	];

    // initialize security module
	moduleLoader.loadModules(...modules).then(() => {
		// api router
		app.use('/api', api({ config, db }));

		app.server.listen(config.get('port'), () => {
			console.log(`Started on port ${app.server.address().port}`);
		});
	});
});

export default app;

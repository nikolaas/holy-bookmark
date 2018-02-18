import { isPromise } from "../utils/lang.utils";

export class ModuleLoader {

    constructor(app, config, db) {
        this.app = app;
        this.config = config;
        this.db = db;
    }

    loadModules(...modules) {
        console.log(`Starting loading of modules`);

        function createTask(module, next, reject) {
            return context => {
                console.log(`Loading module "${module.name}"...`);

                function successHandler() {
                    console.log(`Loading module "${module.name}" finished`);
                    next();
                }

                function errorHandler(error) {
                    console.log(`Loading module "${module.name}" failed with error: `, error);
                    reject(error);
                }

                try {
                    const result = module.handler(context);
                    if (isPromise(result)) {
                        result.then(successHandler).catch(errorHandler);
                    } else {
                        successHandler();
                    }
                } catch (error) {
                    errorHandler(error);
                }
            };
        }

        function createTaskRunner(nextTask, context) {
            return () => nextTask(context);
        }

        const { app, config, db } = this;
        const context = { app, config, db };
        const modulesCount = modules.length;

        return new Promise((resolve, reject) => {
            let task;

            for (let i = modulesCount - 1; i >= 0; i--) {
                const next = i === modulesCount - 1
                    ? resolve
                    : createTaskRunner(task, context);

                task = createTask(modules[i], next, reject);
            }

            task(context);
        });
    }
}


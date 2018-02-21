import { isPromise } from "../../utils/lang.utils";

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

export function loadModules(app, modules) {
    console.log(`Starting loading of modules`);

    const context = { app };
    const modulesCount = modules.length;

    return new Promise((resolve, reject) => {
        let task;

        for (let i = modulesCount - 1; i >= 0; i--) {
            let next = null;
            if (i === modulesCount - 1) {
                next = resolve;
            } else {
                next = createTaskRunner(task, context);
            }
            task = createTask(modules[i], next, reject);
        }

        task(context);
    });
}

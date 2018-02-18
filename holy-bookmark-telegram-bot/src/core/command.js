export class Command {

	constructor(name, executor) {
		this.name = name;
		this.executor = executor;
		this.description = null;
	}

	execute(bot, msg) {
		return this.executor(bot, msg);
	}

}
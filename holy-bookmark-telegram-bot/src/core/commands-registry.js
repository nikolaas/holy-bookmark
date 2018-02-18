class CommandsRegistry {

	constructor() {
		this.commandDescriptors = [];
		this.defaultCommandDescriptor = null;
	}

	hasCommand(descriptor) {
		const commandName = descriptor.command.name;
		return this.commandDescriptors.filter(descriptor => descriptor.command.name === commandName).length > 0;
	}

	registerCommand(descriptor) {
		if (this.hasCommand(descriptor)) {
			throw new Error(`Command "${descriptor.command.name}" already registered.`);
		}
		this.commandDescriptors.push(descriptor);
		console.log(`Register command "${descriptor.command.name}"`);
	}

	registerDefaultCommand(descriptor) {
		this.defaultCommandDescriptor = descriptor;
		console.log(`Register command "${descriptor.command.name}" as default`);
	}

	getCommand(msg) {
		for (let i = 0; i < this.commandDescriptors.length; i++) {
			const descriptor = this.commandDescriptors[i];
			if (descriptor.recognize(msg)) {
				return descriptor.command;
			}
		}
		return this.defaultCommandDescriptor.command;
	}

}

const instance = new CommandsRegistry();

export function registerCommands(commands) {
	commands.forEach(registerCommand);
}

export function registerCommand(command) {
	instance.registerCommand(command);
}

export function registerDefaultCommand(descriptor) {
	instance.registerDefaultCommand(descriptor);
}

export function recognizeCommand(msg) {
	return instance.getCommand(msg);
}

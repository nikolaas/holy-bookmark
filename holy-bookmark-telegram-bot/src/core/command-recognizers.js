export function createCommandRecognizer(command) {
	return msg => msg.text.toLowerCase() === command;
}

export function createCommandsRecognizer(commands) {
	return msg => {
		const text = msg.text.toLowerCase();
		for (let i = 0; i < commands.length; i++) {
			if (text === commands[i]) {
				return true;
			}
		}
		return false;
	}
}

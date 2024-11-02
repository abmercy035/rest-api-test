export default function log(message: any) {
	const error = new Error();
	const stack = error.stack;
	if (!stack) {
		console.log(message, `(unknown location)`);
		return;
	}
	const stackLines = stack.split('\n');
	if (stackLines) {
		const fileNameAndLineNumber = stackLines[2].slice(stackLines[2].lastIndexOf(`${"\\"}`) + 1, stackLines[2].length);
		console.log(`ts:logger:`, message, `(${fileNameAndLineNumber})`);
	} else {
		console.log(message, `file unkn`);
	}
}

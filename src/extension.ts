// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {spawn} from 'child_process';

let output: vscode.OutputChannel | null = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	output = vscode.window.createOutputChannel("Autoreload");
	if (vscode.env.remoteName === 'ssh-remote') {
		output.appendLine('HERE');
		let lastTimer = Date.now();
		setInterval(() => {
			var now = Date.now();
			var diff = (now - lastTimer) / 1000;
			output!.appendLine(`${diff} secs since last update`);
			if(diff > 3600) {
				output!.appendLine('Forcing reload');
				vscode.commands.executeCommand('workbench.action.reloadWindow');
			}
			lastTimer = now;
		}, 5000);
	} else if (vscode.env.remoteName) {
		output.appendLine(vscode.env.remoteName!);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}

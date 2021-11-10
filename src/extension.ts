// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {spawn} from 'child_process';

let DEBUG = false;
let TIMEOUT = DEBUG ? 5 : 3600;
let output: vscode.OutputChannel | null = null;
let shouldTrigger = false;
let interval: NodeJS.Timeout | null = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	output = vscode.window.createOutputChannel("Autoreload");
	if (vscode.env.remoteName === 'ssh-remote' || DEBUG) {
		output.appendLine('Starting');
		let lastTimer = Date.now();
		interval = setInterval(() => {
			if (shouldTrigger) {
				let ping = spawn('ping', ['-c', '1', 'vivek-jain-l01.colo.rubrik.com']);
				ping.on('close', (code) => {
					if (code === 0) {
						vscode.commands.executeCommand('workbench.action.reloadWindow');
					}
					output!.appendLine(`ping exited with code ${code}`);
				});
				return;
			}

			var now = Date.now();
			var diff = (now - lastTimer) / 1000;
			output!.appendLine(`${diff} secs since last update`);
			if(diff > TIMEOUT) {
				output!.appendLine('Timeout hit!');
				shouldTrigger = true;
			}
			lastTimer = now;
		}, 2000);
	} else if (vscode.env.remoteName) {
		output.appendLine(vscode.env.remoteName!);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
}

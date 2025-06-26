// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';

let checkConnectivity = false;
let interval: NodeJS.Timeout | null = null;
let outputChannel: vscode.OutputChannel;

function log(msg: string) {
	outputChannel.appendLine(msg);
}

function getConfig<T>(key: string): T {
	return vscode.workspace.getConfiguration('remreload').get<T>(key)!;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	outputChannel = vscode.window.createOutputChannel('Remreload');
	if (vscode.env.remoteName === 'ssh-remote') {
		log(`Starting at ${new Date()}`);
		let lastCheck = Date.now();
		interval = setInterval(() => {
			if (!checkConnectivity) {
				var now = Date.now();
				var diff = Math.round((now - lastCheck) / 1000);
				// If the delay was longer than 5 seconds, log it.
				if (diff > 5) {
					log(`${(diff / 60).toFixed(2)} minutes since last poll`);
				}
				if (diff > getConfig<number>('assumeDisconnectedMinutes') * 60) {
					log(`Timeout hit at ${new Date()}! Will check connectivity`);
					checkConnectivity = true;
				}
				lastCheck = now;
				return;
			}

			let ping = exec(getConfig<string>('checkConnectivityCommand'));
			ping.on('close', (code) => {
				if (code === 0) {
					log('Reloading');
					vscode.commands.executeCommand('workbench.action.reloadWindow');
				}
				log(`Connectivity check command exited with code ${code}`);
			});
		}, 2000);
	} else {
		log('Not activating because this is not a remote workspace: vscode.env.remoteName = ' + vscode.env.remoteName);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
}

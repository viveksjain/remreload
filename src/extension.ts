// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {exec} from 'child_process';

let DEBUG = false;
let checkConnectivity = false;
let interval: NodeJS.Timeout | null = null;

function log(msg: string) {
	if (DEBUG) {
		console.log(msg);
	}
}

function getConfig<T>(key: string): T {
	return vscode.workspace.getConfiguration('remreload').get<T>(key)!;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	if (vscode.env.remoteName === 'ssh-remote' || DEBUG) {
		log('Starting');
		let lastCheck = Date.now();
		interval = setInterval(() => {
			if (!checkConnectivity) {
				var now = Date.now();
				var diff = (now - lastCheck) / 1000;
				log(`${diff} secs since last update`);
				if(diff > getConfig<number>('assumeDisconnectedMinutes') * 60) {
					console.log('Timeout hit! Will check connectivity');
					checkConnectivity = true;
				}
				lastCheck = now;
				return;
			}

			let ping = exec(getConfig<string>('checkConnectivityCommand'));
			ping.on('close', (code) => {
				if (code === 0) {
					console.log('Reloading');
					vscode.commands.executeCommand('workbench.action.reloadWindow');
				}
				console.log(`Connectivity check command exited with code ${code}`);
			});
		}, 2000);
	} else if (vscode.env.remoteName) {
		log(vscode.env.remoteName!);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
}

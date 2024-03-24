import * as vscode from 'vscode';
import { LOG_LEVELS, PLUGIN_DISPLAY_NAME } from '../constants';

const outputChannel = vscode.window.createOutputChannel(PLUGIN_DISPLAY_NAME);

/**
 * Logs message to the output channel of the plugin
 * @param message 
 * @param level 
 */
export function logger(message: string, level: string = LOG_LEVELS.INFO){
    outputChannel.appendLine(`[${level}]: ${message}`);
}

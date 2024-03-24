import * as https from 'https';
import * as vscode from 'vscode';
import { logger } from './logger';
import { LOG_LEVELS, PLUGIN_CONFIG_NAME, PLUGIN_CONFIG_URLS, PLUGIN_DISPLAY_NAME } from '../constants';
import { CssFile } from '../types';

/**
 * Fetches file from the provided url
 * @param url 
 * @returns {Promise <String>} Returns a promise which resolves to file content as a string
 */
export async function fetchFile(url: string): Promise<string> {
    return new Promise((resolve) => {
        logger(`Fetching file => ${url}`)
        try {
            https.get(url, (response) => {
                let fileContent = '';
                response.on('data', (chunk) => {
                    fileContent += chunk;
                });
                response.on('end', () => {
                    if(fileContent.match(/.*404.*not.*found.*/gi)){
                        logger(`Unable to featch file ${url}: ${fileContent}`, LOG_LEVELS.ERROR);
                        resolve("");
                    }else {
                        logger(`Fetched file -> ${url}`)
                        resolve(fileContent);
                    }
                });
            })
        } catch (error: any) {
            logger(`Unable to fetch file ${url}: ${error.message}`, LOG_LEVELS.ERROR)
            resolve('');
        }
    });
}

/**
 * Load css files from the plugin config
 * @param currentFiles - currently loaded css files
 * @returns {CssFile[]}
 */
export async function loadCssFiles(currentFiles: CssFile[]): Promise<CssFile[]> {
    const config = vscode.workspace.getConfiguration(PLUGIN_CONFIG_NAME);
    logger(`Config for ${PLUGIN_DISPLAY_NAME} is ${JSON.stringify(config)}`);

    const urlsToLoad: string[] = config.get(PLUGIN_CONFIG_URLS) || [];

    return Promise.all(
        urlsToLoad.map(async (url): Promise<CssFile> => {
            const index = currentFiles.findIndex((file) => file.url === url);
            if(index >= 0) {
                return currentFiles[index]
            } else {
                const cssFile: CssFile = {
                    name: url.split("/").pop() || "",
                    url: url,
                    classList: [],
                    content: await fetchFile(url)
                }
               return cssFile;
            }
        })
    )
}

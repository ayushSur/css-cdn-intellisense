import * as css from 'css';
import * as vscode from 'vscode';
import { logger } from './logger';
import { fetchFile } from './fetchFile';
import { CSS_KEYWORDS, LOG_LEVELS, MEDIA, PLUGIN_CONFIG_NAME, RULE } from '../constants';
import { CssFile, CssRule } from '../types';
import { cssComment, formatDeclarations } from './formatter';

/**
 * Extracts css class names from a css file
 * @param {string} fileContent 
 * @returns {CssRule []} Return array of css rules present in the css file
 */
function getClassNamesFromCssFile(fileContent: string): CssRule[] {
    const classList: CssRule[] = []

    // Parse the css file
    const ast = css.parse(fileContent);

    // Extract class names from the css rules
    function extractClassNameFromRules(
        rules: css.Rule[] | [],
        media: string = ""
    ): void {
        rules.forEach((rule: any) => {
            if (rule.type === RULE && rule.selectors) {
                rule.selectors.forEach((selector: string) => {
                    if (
                        !(
                            selector[0] !== "."
                            || CSS_KEYWORDS.some((keyword) => selector.includes(keyword))
                        )
                    ) {
                        const index = classList.findIndex(
                            (rule) => rule.selector === selector.trim()
                        );
                        if (index >= 0) {
                            classList[index].declaration = formatDeclarations(
                                classList[index],
                                rule.declarations,
                                media
                            );
                        } else {
                            const cssRule: CssRule = {
                                selector: selector.trim(),
                                declaration: "",
                            };
                            cssRule.declaration = formatDeclarations(
                                cssRule,
                                rule.declarations,
                                media
                            );
                            classList.push(cssRule);
                        }
                    }
                })
            } else if (rule.type === MEDIA && rule.rules) {
                extractClassNameFromRules(rule.rules, rule.media);
            }
        })
    }

    extractClassNameFromRules(ast?.stylesheet?.rules || []);
    return classList;
}

/**
 * Returns a consolidated class list from multiple css files
 * @param {CssFile[]} parsedFiles - Array for parsed css files
 * @returns {CssRule[]}
 */
function resolveCssFiles(parsedFiles: CssFile[]): CssRule[] {
    const cssList: CssRule[] = [];

    parsedFiles.forEach(({ name, classList }) => {
        classList.forEach(({ selector, declaration }) => {
            const index = cssList.findIndex((rule) => rule.selector === selector);
            const hasFileName = declaration.includes(name);
            const declarationString = cssComment(!hasFileName ? name : "") + declaration;
            if (index >= 0) {
                cssList[index].declaration += "\n\n" + declarationString;
            } else {
                cssList.push({
                    selector,
                    declaration: declarationString
                });
            }
        });
    });

    return cssList;
}

/**
 * Gets all the css class names from the provided css files
 * @returns {string []}
 */
export function getClassNames(cssFiles: CssFile[]): CssRule[] {
    try {
        const parsedFiles: CssFile[] = cssFiles.map(
            (file): CssFile => ({
                ...file,
                classList: getClassNamesFromCssFile(file.content),
            })
        )
        return resolveCssFiles(parsedFiles);
    } catch (error: any) {
        logger(`Unable to get class names: ${error.message}`, LOG_LEVELS.ERROR);
        return [];
    }
}

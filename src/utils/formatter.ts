import { DECLARATION } from "../constants";
import { CssRule } from "../types";

/**
 * Formats css declarations into a presentable string
 * @param {CssRule} rule - Existing rule
 * @param {Array} declarations - Declarations to add
 * @param {string} media - Media query id present
 * @returns {string} - Formatted declaration
 */
export function formatDeclarations(
    rule: CssRule,
    declarations: [],
    media: string
): string {
    const alreadyHaveDeclarations: boolean = rule.declaration.length > 0;

    let updatedDeclaration: string = alreadyHaveDeclarations
        ? rule.declaration.slice(0, rule.declaration.length - 1)
        : `\n${rule.selector} { \n`;
    
    declarations.forEach((declaration: any) => {
        if (declaration.type === DECLARATION) {
            updatedDeclaration += `\t${
                declaration.property
            }: ${declaration.value.replace(/\!/g, " !")}; ${cssComment(media)} \n`; 
        }
    });
    updatedDeclaration += "}";
    return updatedDeclaration;
}

/**
 * Generates a CSS comment
 * @param {string} comment - Comment to be added 
 * @returns {String} - CSS formatted comment
 */
export function cssComment(comment: string): string {
    return comment ? `/*! ${comment} */` : "";
}

/**
 * Removes dot from selector 
 * @param {string} selector 
 * @returns {string}
 */
export function formatSelector(selector: string) {
    return selector.replace(/\./g, " ").trim()
}
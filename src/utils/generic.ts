import { COLOR_CODES_REGEX, CLASS_NAME_ATTRIBUTE } from "../constants"

/**
 * Checks for a single color code in declaration
 * @param {string} declaration 
 * @returns {string} color code incase just one color is found else returns empty string
 */
export function getOnlyColorCode(declaration: string): string {
    let counter = 0;
    let colorCode = '';

    const declarationWithoutSelector = declaration.replace(/\.[a-zA-Z0-9-]*/gm, '');
    const numberOfDeclarations = [...declarationWithoutSelector.matchAll(/\:/gm)].length;
    const colorCodeRegex = new RegExp(COLOR_CODES_REGEX, 'gm');
    const colorDeclarations = [...declarationWithoutSelector.matchAll(colorCodeRegex)];

    colorDeclarations.forEach((declaration) => {
        const color = declaration[0];
        if (colorCode === '' || colorCode === color) {
            colorCode = color;
            counter++;
        } else {
            return ''
        }
    });

    return counter === numberOfDeclarations ? colorCode : '';
}

/**
 * Returns true if the cursor is within the className attribute
 * @param {string} lineTillCurrentPosition - line till the cursor position 
 * @returns {boolean}
 */
export function isInClassNameAttribute(
    lineTillCurrentPosition: string
): boolean {
    const equalSeparatedText = lineTillCurrentPosition.split("=");

    return (
        equalSeparatedText.length > 1
        && equalSeparatedText[equalSeparatedText.length - 2]
            .trim()
            .endsWith(CLASS_NAME_ATTRIBUTE)
        && [
            ...equalSeparatedText[equalSeparatedText.length - 1]
                .trim()
                .matchAll(/['"`]/g),
        ].length % 2 === 1
    );
}
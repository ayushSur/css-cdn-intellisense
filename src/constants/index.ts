import { logLevel } from '../types';

export const PLUGIN_DISPLAY_NAME: string = "CDN CSS IntelliSense";
export const PLUGIN_CONFIG_NAME: string = "cdnCssIntellisense";
export const PLUGIN_CONFIG_URLS: string = "urls";
export const LOG_LEVELS: logLevel = {
    INFO: 'Info',
    DEBUG: 'Debug',
    WARNING: 'Warning',
    ERROR: 'Error',
};
export const CSS_KEYWORDS: string[] = [" ", ">" , ":", "+", "*", "~", "[", "("];
export const RULE: string = "rule";
export const MEDIA: string = "media";
export const DECLARATION: string = "declaration";
export const CSS_COLOR_KEYWORDS: string[] = [
    'black',
    'gray',
    'silver',
    'white',
    'maroon',
    'red',
    'purple',
    'fuchsia',
    'green',
    'lime',
    'olive',
    'yellow',
    'navy',
    'blue',
    'teal',
    'aqua',
    'orange',
];
export const PREDEFINED_COLORS = CSS_COLOR_KEYWORDS.join('|');
export const HEX_CODE = 'hexCode';
export const RGB_CODE = 'rgbCode';
export const COLOR_CODE = 'colorCode';
export const COLOR_CODES_REGEX = `((?<${HEX_CODE}>#[a-zA-Z0-9]+)|(?<${RGB_CODE}>rgb\([0-9\,\s]\)+)|(?<${COLOR_CODE}>(${PREDEFINED_COLORS})))`
export const CLASS_NAME_ATTRIBUTE = 'className';
export const DECLARED_STYLES = "Declared styles";
export const CSS_LANGUAGE_TYPE = "css";
export const SUPPORTED_FILE_TYPES = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
];
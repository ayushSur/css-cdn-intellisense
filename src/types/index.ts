export type logLevel = {
    INFO: string,
    DEBUG: string,
    WARNING: string,
    ERROR: string, 
}

export type CssRule = {
    selector: string;
    declaration: string;
}

export type CssFile = {
    url: string;
    name: string;
    content: string;
    classList: CssRule[];
}

import { CssFile, CssRule } from "../types";
import { loadCssFiles } from "../utils/fetchFile";
import { getClassNames } from "../utils/generateClassList";

class CssIntellisense {
    private static classList: CssRule[] = [];
    private static _instance: CssIntellisense;
    private static cssFiles: CssFile[] = [];

    constructor() {
        if(!CssIntellisense._instance) {
            CssIntellisense._instance = this;
        }
        return CssIntellisense._instance;
    }

    private static async loadFiles() {
        CssIntellisense.cssFiles = await loadCssFiles(CssIntellisense.cssFiles);
    }

    static async fetchClasses() {
        await CssIntellisense.loadFiles();
        CssIntellisense.classList = await getClassNames(CssIntellisense.cssFiles);
    }

    static async getClassNames(): Promise <CssRule []> {
        return CssIntellisense.classList
    }
}

export default CssIntellisense;
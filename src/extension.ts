import * as vscode from 'vscode';
import { parse, formatRgb } from 'culori';
import CssIntellisense from './classes/CssIntellisense';
import { getOnlyColorCode, isInClassNameAttribute } from './utils/generic';
import { CssRule } from './types';
import { formatSelector } from './utils/formatter';
import { CSS_LANGUAGE_TYPE, DECLARED_STYLES, PLUGIN_CONFIG_NAME, PLUGIN_DISPLAY_NAME, SUPPORTED_FILE_TYPES } from './constants';
import { logger } from './utils/logger';

class CssCompletionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
        ) {
        // Get current line text
        const lineText = document.lineAt(position).text;
        const lineTillCurrentPosition = lineText.substr(0, position.character);
        
        if (isInClassNameAttribute(lineTillCurrentPosition)) {
            const completionItems: vscode.CompletionItem[] = [];
            const cssClassNames: CssRule[] = await CssIntellisense.getClassNames();

            cssClassNames.forEach(({ selector, declaration }) => {
                const item = new vscode.CompletionItem(formatSelector(selector));
                const colorCode = getOnlyColorCode(declaration);
                if(colorCode) {
                    item.kind = vscode.CompletionItemKind.Color;
                    item.documentation = formatRgb(parse(colorCode));
                    item.detail = declaration
                } else {
                    item.kind = vscode.CompletionItemKind.Value;
                    item.detail = DECLARED_STYLES;
                    const documentation = new vscode.MarkdownString();
                    documentation.appendCodeblock(declaration, CSS_LANGUAGE_TYPE);
                    item.documentation = documentation;
                }
                completionItems.push(item);
            })

            return completionItems;
        }
        return [];
    }
}

export async function activate(context: vscode.ExtensionContext) {
    logger(`${PLUGIN_DISPLAY_NAME} is active`)
    await CssIntellisense.fetchClasses();

    vscode.workspace.onDidChangeConfiguration( async (event) => {
        if(event.affectsConfiguration(PLUGIN_CONFIG_NAME)){
            await CssIntellisense.fetchClasses();
        }
    });

    const provider = new CssCompletionProvider();

    const providers = SUPPORTED_FILE_TYPES.map((fileType) => 
        vscode.languages.registerCompletionItemProvider(fileType, provider)
    );

    context.subscriptions.push(...providers);
}

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.selectTextInQuotes', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const cursorPosition = editor.selection.active;

            // Get the current line text
            const lineText = document.lineAt(cursorPosition.line).text;
            const posLeftDoubleQuote = Math.max(lineText.lastIndexOf('"', cursorPosition.character - 1), 0);
            const posRightDoubleQuote = lineText.indexOf('"', cursorPosition.character);
            const posLeftSingleQuote = Math.max(lineText.lastIndexOf('\'', cursorPosition.character - 1), 0);
            const posRightSingleQuote = lineText.indexOf('\'', cursorPosition.character);
            const posLeftBackwardQuote = Math.max(lineText.lastIndexOf('\`', cursorPosition.character - 1), 0);
            const posRightBackwardQuote = lineText.indexOf('\`', cursorPosition.character);

            let start =0, end = 0;
            // if the cursor is between 2 double quotes
            if (posLeftDoubleQuote >= 0 && posRightDoubleQuote > posLeftDoubleQuote) {
                // if the cursor is also between 2 single quotes which are both closer to cursor, use them a selection delimiter
                if ((posLeftSingleQuote >= 0 && posRightSingleQuote > posLeftSingleQuote) && (posLeftSingleQuote > posLeftDoubleQuote && posRightSingleQuote < posRightDoubleQuote)) {
                    start = posLeftSingleQuote;
                    end = posRightSingleQuote;
                }
                // else, use double quotes
                else{
                    start = posLeftDoubleQuote;
                    end = posRightDoubleQuote;
                }
            }
            // else, if the cursor is between 2 single quotes, use them as selection delimiter
            else if(posLeftSingleQuote >= 0 && posRightSingleQuote > posLeftSingleQuote){
                start = posLeftSingleQuote;
                end = posRightSingleQuote;
            }
            // else, if the cursor is between 2 backward quotes, use them as selection delimiter
            else if(posLeftBackwardQuote >= 0 && posRightBackwardQuote > posLeftBackwardQuote){
                start = posLeftBackwardQuote;
                end = posRightBackwardQuote;
            }

            // Check if start and end are valid
            if (start !== 0 || end !== 0) {
                const startPosition = new vscode.Position(cursorPosition.line, start + 1);
                const endPosition = new vscode.Position(cursorPosition.line, end);
                const selection = new vscode.Selection(startPosition, endPosition);
                editor.selection = selection;
            } else {
                vscode.window.showInformationMessage("Cursor is not within quotes.");
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

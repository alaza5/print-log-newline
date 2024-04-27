/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";

const defaultLoggerMap: Record<string, string> = {
  fsharp: 'printfn $"${label} {value}"',
  go: 'fmt.Println("${label}", ${label})',
  java: 'System.out.println("${label}", ${value});',
  javascript: 'console.log("${label}", ${value});',
  javascriptreact: 'console.log("${label}", ${value});',
  rust: 'println!("{} ${label}", ${value});',
  typescript: 'console.log("${label}", ${value});',
  typescriptreact: 'console.log("${label}", ${value});',
};

export function activate(context: vscode.ExtensionContext) {
  const printCommand = vscode.commands.registerCommand(
    "printLoggerShortcut.insertPrint",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const selectedCode = editor.document.getText(editor.selection);
      if (!selectedCode) {
        return;
      }

      const languageId = vscode.window.activeTextEditor?.document.languageId;
      if (!languageId) {
        vscode.window.showErrorMessage("Unknow language: " + languageId);
        return;
      }

      const config: vscode.WorkspaceConfiguration =
        vscode.workspace.getConfiguration("printLoggerShortcut");

      const logPrefix = config?.logPrefix ?? "";
      const loggerMap = config?.loggerMap;

      const snippetString =
        loggerMap?.[languageId] ?? defaultLoggerMap[languageId];
      if (!snippetString) {
        vscode.window.showErrorMessage("Unsupported language: " + languageId);
        return;
      }

      const newLineRow = editor.selection.active.line + 1;

      await vscode.commands.executeCommand("editor.action.insertLineAfter");

      await editor
        .edit((editBuilder: vscode.TextEditorEdit) => {
          const insertedLine = editor.document.lineAt(newLineRow);

          const contentPos = new vscode.Position(
            newLineRow,
            insertedLine.firstNonWhitespaceCharacterIndex,
          );

          const content = snippetString
            .replace("${label}", `${logPrefix}${selectedCode}`)
            .replace("${value}", selectedCode);

          editBuilder.insert(contentPos, content);
        })
        .then(() => {
          const vimExtension = vscode.extensions.getExtension("vscodevim.vim");
          if (vimExtension) {
            vscode.commands.executeCommand("extension.vim_escape");
          }
        });
    },
  );

  context.subscriptions.push(printCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}

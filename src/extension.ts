'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as changeCase from 'change-case';
import { Observable } from 'rxjs';

import { FileHelper } from './FileHelper';
import { Config } from './config.interface';

import * as _ from "lodash";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.genAngular2ComponentFiles', (uri) => {
        // The code you place here will be executed every time your command is executed

        let configPrefix: String = 'ng2ComponentGenerator';
        let _workspace = vscode.workspace;
        let defaultConfig: Config = FileHelper.getDefaultConfig();
        let userConfig: Config = <Config>_workspace.getConfiguration((configPrefix + '.config'));
        let config: Config;

        if (userConfig.global || userConfig.files) {
            config = _.assign(config, defaultConfig, userConfig) as Config;
        }

        // Display a dialog to the user
        let enterComponentNameDialog$ = Observable.from(
            vscode.window.showInputBox(
                {prompt: 'Please enter component name in camelCase'}
            ));


        enterComponentNameDialog$
            .concatMap( val => {
                    if (val.length === 0) {
                        throw new Error('Component name can not be empty!');
                    }
                    let componentName = changeCase.paramCase(val);
                    let componentDir = FileHelper.createComponentDir(uri, componentName);

                    return Observable.forkJoin(
                        FileHelper.createComponent(componentDir, componentName, config.global, config.files.component),
                        FileHelper.createHtml(componentDir, componentName, config.files.html),
                        FileHelper.createCss(componentDir, componentName, config.files.css),
                        FileHelper.createModule(componentDir, componentName, config.global, config.files.module)
                    );
                }
            )
            .concatMap(result => Observable.from(result))
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error('Could not open file!');
                };
                return Observable.from(vscode.window.showTextDocument(textDocument))
            })
            .do(editor => {
                if (!editor) {
                    throw new Error('Could not open file!')
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage('Component Successfuly created!'),
                err => vscode.window.showErrorMessage(err.message)
            );

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
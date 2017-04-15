import { HTMLConfig } from './config/types/html-config.interface';
import { CSSConfig } from './config/types/css-config.interface';
import { ModuleConfig } from './config/types/module-config.interface';
import { ComponentConfig } from './config/types/component-config.interface';
import { GlobalConfig } from './config/global.interface';
import { Config } from './config.interface';
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import * as changeCase from 'change-case';
import { Observable } from 'rxjs';

export class FileHelper {
    private static createFile = <(file: string, data: string) => Observable<{}>>Observable.bindNodeCallback(fse.outputFile);
    private static assetRootDir: string = path.join(__dirname, '../../assets');

    public static createComponent(componentDir: string, componentName: string, globalConfig: GlobalConfig, config: ComponentConfig): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/component.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let componentContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{selector}/g, componentName)
            .replace(/{templateUrl}/g, `${componentName}.component.html`)
            .replace(/{styleUrls}/g, `${componentName}.component.css`)
            .replace(/{className}/g, changeCase.pascalCase(componentName))
            .replace(/{quotes}/g, this.getQuotes(globalConfig));

        let filename = `${componentDir}/${componentName}.component.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static createModule(componentDir: string, componentName: string, globalConfig: GlobalConfig, config: ModuleConfig): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/module.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let moduleContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{componentName}/g, componentName)
            .replace(/{className}/g, changeCase.pascalCase(componentName))
            .replace(/{quotes}/g, this.getQuotes(globalConfig));

        let filename = `${componentDir}/${componentName}.module.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, moduleContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static createHtml(componentDir: string, componentName: string, config: HTMLConfig): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/html.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let htmlContent = fs.readFileSync( templateFileName ).toString();

        let filename = `${componentDir}/${componentName}.component.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, htmlContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static createCss(componentDir: string, componentName: string, config: CSSConfig): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/css.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let cssContent = fs.readFileSync( templateFileName ).toString();


        let filename = `${componentDir}/${componentName}.component.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static createComponentDir(uri: any, componentName: string, globalConfig: GlobalConfig): string {
        let contextMenuSourcePath;

        if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
            contextMenuSourcePath = uri.fsPath;
        } else if (uri) {
            contextMenuSourcePath = path.dirname(uri.fsPath);
        } else {
            contextMenuSourcePath = vscode.workspace.rootPath;
        }

        let componentDir = `${contextMenuSourcePath}`;
        if(globalConfig.generateFolder) {
            componentDir = `${contextMenuSourcePath}/${componentName}`;
            fse.mkdirsSync(componentDir);
        }

        return componentDir;
    }

    public static getDefaultConfig(): any {
        let content = fs.readFileSync( this.assetRootDir + '/config/config.json' ).toString();
        content = content.replace(/\${workspaceRoot}/g, vscode.workspace.rootPath);
        return JSON.parse(content);
    }

    public static resolveWorkspaceRoot(path: string): string {
        return path.replace('${workspaceRoot}', vscode.workspace.rootPath);
    }

    private static getQuotes(config: GlobalConfig) {
        return config.quotes === "double" ? '"' : '\'';
    }

}

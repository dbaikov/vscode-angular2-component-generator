import { WorkspaceConfiguration } from 'vscode';

export interface Config extends WorkspaceConfiguration {
    files: {
        component: {
            create: boolean,
            extension: string,
            template?: string
        },
        css: {
            create: boolean,
            extension: string,
            template?: string
        },
        html: {
            create: boolean,
            extension: string,
            template?: string
        },
        module: {
            create: boolean,
            extension: string,
            template?: string
        }
    };
};

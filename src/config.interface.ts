import { FileConfig } from './config/files.interface';
import { GlobalConfig } from './config/global.interface';
import { WorkspaceConfiguration } from 'vscode';

export interface Config extends WorkspaceConfiguration {
    global: GlobalConfig,
    files: FileConfig
};

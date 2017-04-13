import { ModuleConfig } from './types/module-config.interface';
import { HTMLConfig } from './types/html-config.interface';
import { CSSConfig } from './types/css-config.interface';
import { ComponentConfig } from './types/component-config.interface';
export interface FileConfig {
    component: ComponentConfig,
    css: CSSConfig,
    html: HTMLConfig,
    module: ModuleConfig
}
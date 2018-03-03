import { ICommandButtonProps } from "../../fabric/types";

/**
 * WebPart
 */
export interface IWebPart {
    /** The webpart configuration. */
    cfg: IWebPartCfg;

    /** The webpart information. */
    info: IWebPartInfo;
}

/**
 * WebPart Configuration
 */
export interface IWebPartCfg {
    /** The webpart id */
    WebPartId?: string;
}

/**
 * WebPart Edit Panel
 */
export interface IWebPartEditPanel {
    /** Menu */
    menuLeftCommands?: Array<ICommandButtonProps>;

    /** Menu */
    menuRightCommands?: Array<ICommandButtonProps>;

    /** The render footer event. */
    onRenderFooter?: (el: HTMLDivElement, wpInfo: IWebPartInfo) => void;

    /** The render header event. */
    onRenderHeader?: (el: HTMLDivElement, wpInfo: IWebPartInfo) => void;

    /** The save event. */
    onSave?: (wpCfg: IWebPartCfg) => IWebPartCfg;

    /** The edit panel type. */
    panelType?: number;

    /** True to hide the save button. */
    showSaveButton?: boolean;
}

/**
 * WebPart Information
 */
export interface IWebPartInfo {
    /** The configuration */
    cfg: IWebPartCfg;

    /** The element to render the webpart to */
    el: HTMLElement;

    /** The webpart id */
    wpId: string;
}

/**
 * WebPart Object
 */
export interface IWebPartObject {
    /** The JSOM context object */
    Context: any;

    /** The webpart properties object */
    Properties: any;

    /** The webpart id */
    WebPartId: string;

    /** The webpart html element */
    WebPart: HTMLElement;

    /** The webpart definition object */
    WebPartDefinition: any;
}

/**
 * WebPart Properties
 */
export interface IWebPartProps {
    /** The optional configuration element id */
    cfgElementId?: string;

    /** The class name. */
    className?: string;

    /** The target element id to render the webpart to */
    elementId?: string;

    /** The edit panel */
    editPanel?: IWebPartEditPanel;

    /** The optional help link properties */
    helpProps?: {
        /** The link title */
        title?: string;

        /** The link url */
        url: string;
    };

    /** The post render event */
    onPostRender?: (wp: IWebPartInfo, ...args) => void;

    /** The render event triggered when the page is in 'Display' mode */
    onRenderDisplay?: (wp: IWebPartInfo) => any;

    /** The render event triggered when the page is in 'Edit' mode */
    onRenderEdit?: (wp: IWebPartInfo) => any;
}
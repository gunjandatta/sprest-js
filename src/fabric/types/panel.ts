import { Fabric, IProps } from ".";

/**
 * Panel
 */
export interface IPanel {
    /** Returns the fabric component. */
    get(): Fabric.IPanel;

    /** Hides the panel. */
    hide: () => void;

    /**
     * Sets the header text.
     * @param html - The header html.
     */
    setHeaderText(html: string): HTMLDivElement;

    /**
     * Shows the panel.
     * @param content - The panel content.
     * @returns The panel content element.
     */
    show(content?: string): HTMLDivElement;
}

/**
 * Panel Properties
 */
export interface IPanelProps extends IProps {
    /** The header text. */
    headerText?: string;

    /** The panel content. */
    panelContent?: string;

    /**
     * The panel type
     * @default medium
    */
    panelType?: number;

    /**
     * True to show the close button.
     * @default true
     */
    showCloseButton?: boolean;

    /**
     * Flag to display it by default.
     * @default false
    */
    visible?: boolean;
}
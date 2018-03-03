import { Fabric, IProps } from ".";

/**
 * Panel
 */
export interface IPanel {
    /** Returns the fabric component. */
    get(): Fabric.IPanel;

    /** Returns the panel content element. */
    getContent(): HTMLDivElement;

    /** Returns the panel footer element. */
    getFooter(): HTMLDivElement;

    /** Returns the panel header element. */
    getHeader(): HTMLDivElement;

    /** Hides the panel. */
    hide: () => void;

    /** Returns true if the panel is open, false otherwise. */
    isOpen: () => boolean;

    /**
     * Shows the panel.
     * @param content - The panel content.
     * @returns The panel content element.
     */
    show(content?: string): HTMLDivElement;

    /**
     * Updates the panel content.
     * @param content - The panel content.
     * @returns The panel content element.
     */
    updateContent(content?: string): HTMLDivElement;

    /**
     * Updates the panel footer.
     * @param content - The header content.
     * @returns The panel footer element.
     */
    updateFooter(content?: string): HTMLDivElement;

    /**
     * Updates the panel header.
     * @param content - The footer content.
     * @returns The panel header element.
     */
    updateHeader(content?: string): HTMLDivElement;
}

/**
 * Panel Properties
 */
export interface IPanelProps extends IProps {
    /** The header text. */
    headerText?: string;

    /** The panel content. */
    panelContent?: string;

    /** The panel footer content. */
    panelFooter?: string;

    /** The panel header content. */
    panelHeader?: string;

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
import { IProps } from ".";

// Panel
export interface IPanel {
    /** Returns the panel element. */
    getContent(): HTMLElement;

    /** Method to get the panel element */
    getPanel(): HTMLElement;

    /** Hides the panel. */
    hide: () => void;

    /**
     * Queries the panel for a single element.
     * @param qs - The query selector.
     */
    query(qs?: string): HTMLElement;

    /**
     * Queries the panel for multiple elements.
     * @param qs - The query selector.
     */
    queryAll(qs?: string): Array<HTMLElement>;

    /**
     * Sets the header text.
     * @param html - The header html.
     */
    setHeaderText(html: string): HTMLElement;

    /**
     * Shows the panel.
     * @param content - The panel content.
     * @returns The panel content element.
     */
    show(content?: string): HTMLElement;

    /** Shows the close button. */
    showCloseButton();
}

// Panel
export interface IPanelProps extends IProps {
    /** The header text */
    headerText?: string;

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
import { IWebPartProps } from ".";

/**
 * WebPart Tabs
 */
export interface IWPTabsProps extends IWebPartProps {
    /** The class name. */
    className?: string;
    
    /** True to render text. */
    isLarge?: boolean;

    /** True to render tabs. */
    isTabs?: boolean;

    /** Tab type */
    type?: number;
}
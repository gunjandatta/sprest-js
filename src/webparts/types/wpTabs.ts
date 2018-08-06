import { IWebPartProps } from "./wp";

/**
 * WebPart Tabs
 */
export interface IWPTabsProps extends IWebPartProps {
    /** True to render text. */
    isLarge?: boolean;

    /** True to render tabs. */
    isTabs?: boolean;

    /** Tab type */
    type?: number;
}
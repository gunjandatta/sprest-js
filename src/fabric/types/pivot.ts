import { Fabric, IProps } from ".";

/**
 * Pivot
 */
export interface IPivotProps extends IProps {
    /** True to render text. */
    isLarge?: boolean;

    /** True to render tabs. */
    isTabs?: boolean;

    /** The tabs. */
    tabs: Array<IPivotLink>
}

/**
 * Pivot Link
 */
export interface IPivotLink {
    /** The class name. */
    className?: string;

    /** The tab content. */
    content?: string;

    /** True for the selected tabs. */
    isSelected?: boolean;

    /** The tab name. */
    name: string;
}
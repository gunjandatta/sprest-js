import { IProps } from ".";

export interface IButtonProps extends IProps {
    /**
     * Set to true, to disable the button.
     * @default false
     */
    disable?: boolean;

    /** The button url. */
    href?: string;

    /** The click event */
    onClick?: (btn?: HTMLButtonElement) => void;

    /** The button text */
    text: string;
}
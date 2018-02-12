import { IComponentProps, IProps } from ".";

/**
 * DatePicker
 */
export interface IDatePicker {
    /** Returns the datetime element. */
    get(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the datetime value. */
    getValue(): boolean;
}

/**
 * DatePicker Properties
 */
export interface IDatePickerProps extends IComponentProps {
    /** The change event */
    onChange?: (value: Date) => void;

    /** Flag to show the time */
    showTime?: boolean;

    /** The datetime value */
    value?: Date;
}
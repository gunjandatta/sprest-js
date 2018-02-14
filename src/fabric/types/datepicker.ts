import { IComponentProps, IProps } from ".";

/**
 * DatePicker
 */
export interface IDatePicker {
    /** Returns the date picker element. */
    getDate(): HTMLElement;

    /** Returns the time picker element. */
    getTime(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the datetime value. */
    getValue(): Date;
}

/**
 * DatePicker Properties
 */
export interface IDatePickerProps extends IComponentProps {
    /** The change event */
    onChange?: (value: Date) => void;

    /** Flag to show the time */
    showTime?: boolean;

    /** The time picker type. */
    timePickerType?: number;

    /** The datetime value */
    value?: Date;
}
/** Properties */
export interface IProps {
    /** The class name to apply to the main element. */
    className?: string;

    /** The element to render the panel to. */
    el: Element | HTMLElement;
}

/** Component Properties */
export interface IComponentProps extends IProps {
    /**
     * Flag to disable the component.
     * @default false
     */
    disable?: boolean;

    /** The component label. */
    label?: string;

    /** The change event */
    onChange?: (value: any) => void;

    /** The required flag. */
    required?: boolean;

    /** The component value */
    value?: any;
}
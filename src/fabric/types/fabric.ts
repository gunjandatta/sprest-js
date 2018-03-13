/**
 * Callout
 */
export interface ICallout {
    _addTarget: HTMLDivElement;
    _closeButton: HTMLButtonElement;
    _container: HTMLDivElement;
    _contextualHost: IContextualHost
    _position: string;
}

/**
 * CheckBox
 */
export interface ICheckBox {
    _choiceField: HTMLLabelElement;
    _choiceInput: HTMLInputElement;
    _container: HTMLDivElement;

    /** Checks the checkbox. */
    check();

    /** Gets the value of the checkbox. */
    getValue(): boolean;

    /** Removes the event listeners. */
    removeListeners();

    /** Toggles the checkbox. */
    toggle();

    /** Unchecks the checkbox. */
    unCheck();
}

/**
 * Command Bar
 */
export interface ICommandBar {
    _container: HTMLDivElement;
}

/**
 * Command Button
 */
export interface ICommandButton {
    _container: HTMLDivElement;
}

/**
 * Contextual Host
 */
export interface IContextualHost {
    _arrow: HTMLDivElement;
    _container: HTMLDivElement;
    _contextualHost: HTMLDivElement;
    _contextualHostMain: HTMLDivElement;
    _hasArrow: boolean;
    contains(value: HTMLElement);
    disposeModal();
    setChildren(value: IContextualHost);
}

/**
 * Contextual Menu
 */
export interface IContextualMenu {
    _container: HTMLDivElement;
    _hostTarget: HTMLDivElement;
    _position: string;
    _host: IContextualHost;
    _isOpen: boolean;
}

/**
 * Date Picker
 */
export interface IDatePicker {
    picker: {
        component: {
            formats: any;
            item: any;
            key: any;
            queue: any;
            settings: any;
        };
        clear: Function;
        close: Function;
        get: Function;
        off: Function;
        on: Function;
        open: Function;
        set: Function;
        start: Function;
        stop: Function;
    }
}

/**
 * Dialog
 */
export interface IDialog {
    _actionButtonElements: Array<HTMLButtonElement>;
    _closeButtonElement: HTMLButtonElement;
    _dialog: HTMLDivElement;
    close();
    open();
}

/**
 * List
 */
export interface IList {
    _container: HTMLUListElement;
    _listItemComponents: Array<IListItem>;
}

/**
 * List Item
 */
export interface IListItem {
    _container: HTMLLIElement;
    _toggleElement: HTMLDivElement;
}

/**
 * Overlay
 */
export interface IOverlay {
    // The overlay element.
    overlayElement: HTMLDivElement;

    // Hides the overlay.
    hide();

    // Removes the overlay.
    remove();

    // Shows the overlay.
    show();
}

/**
 * Panel Component
 */
export interface IPanel {
    // Flag to animate the overlay.
    _animateOverlay: boolean;

    // The click handler.
    _clickHandler: EventListener;

    // The panel close button.
    _closeButton: HTMLElement;

    // The panel direction.
    _direction: string;

    // The panel element.
    _panel: HTMLDivElement;

    // The panel host element.
    panelHost: IPanelHost;

    /**
     * Closes the panel.
     * @param callback - Optional callback method.
     */
    dismiss(callback?: Function);
}

/**
 * Panel Host Component
 */
export interface IPanelHost {
    // The overlay.
    overlay: IOverlay;

    // The panel host element.
    panelHost: HTMLDivElement;

    // Method to hide the overlay
    dismiss();

    // Method to update the overlay
    update(layer: Node, callback?: Function);
}

/**
 * People Picker Component
 */
export interface IPeoplePicker {
    _container: HTMLDivElement
    _contextualHostView: IContextualHost;
    _isContextualMenuOpen: boolean;
    _peoplePickerMenu: HTMLDivElement;
    _peoplePickerSearch: HTMLInputElement;
    _peoplePickerSearchBox: HTMLDivElement;
    _peoplePickerResults: Array<HTMLDivElement>;
    _selectedCount: HTMLDivElement;
    _selectedPeople: HTMLDivElement;
    _selectedPlural: HTMLDivElement;
    _selectResult(ev: Event);
}

/**
 * Pivot
 */
export interface IPivot {
    _container: HTMLDivElement
}

/**
 * Spinner Component
 */
export interface ISpinner {
    animationSpeed: number;
    eightSize: number;
    fadeIncrement: number;
    interval: number;
    numCircles: number;
    offsetSize: number;
    parentSize: number;
    spinner: HTMLElement;
    start();
    stop();
}

/**
 * Table
 */
export interface ITable {
    container: HTMLTableElement;
}

/**
 * Text Field Component
 */
export interface ITextField {
    _container: HTMLDivElement;
    _textField: HTMLInputElement;
    _textFieldLabel: HTMLLabelElement;
}
/**
 * Toggle Component
 */
export interface IToggle {
    _container: HTMLDivElement;
}
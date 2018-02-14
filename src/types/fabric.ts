/**
 * Contextual Host
 */
export interface IContextualHost {
    _arrow: HTMLDivElement;
    _container: HTMLDivElement;
    _contextualHost: HTMLDivElement;
    _contextualHostMain: HTMLDivElement;
    _hasArrow: boolean;
    disposeModal: () => void;
}

/**
 * Contextual Menu
 */
export interface IContextualMenu {
    _containter: HTMLDivElement;
    _hostTarget: HTMLDivElement;
    _position: string;
    _host: IContextualHost;
    _isOpen: boolean;
}

/**
 * Overlay Component
 */
export interface IOverlay {
    // The overlay element.
    overlayElement: HTMLDivElement;

    // Hides the overlay
    hide();

    // Removes the overlay
    remove();

    // Shows the overlay
    show();
}

/**
 * Panel Component
 */
export interface IPanel {
    // Flag to animate the overlay.
    _animateOverlay: boolean;

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
}

/**
 * Text Field Component
 */
export interface ITextField {
    _container: HTMLDivElement;
    _textField: HTMLInputElement;
    _textFieldLabel: HTMLLabelElement;
}
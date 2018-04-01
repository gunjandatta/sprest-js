import { Fabric, ISearchBox, ISearchBoxProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Search Box Types
 */
export enum SearchBoxTypes {
    Collapsed = 0,
    CommandBar = 1,
    Default = 2,
}

/**
 * Search Box
 */
export const SearchBox = (props: ISearchBoxProps): ISearchBox => {
    // Method to get the fabric component
    let get = (): Fabric.ISearchBox => {
        // Return the textfield
        return _searchbox;
    }

    // Method to get the value
    let getValue = () => {
        // Get the text field value
        return _searchbox._searchBoxField.value || "";
    }

    // Method to set the value
    let setValue = (value: string) => {
        // Set the text field
        _searchbox._searchBoxField.value = value || "";
    }

    // Add the search box html
    props.el.innerHTML = Templates.SearchBox(props);

    // Create the textfield
    let _searchbox: Fabric.ISearchBox = new fabric.SearchBox(props.el.firstElementChild);

    // Set the key up event
    _searchbox._searchBoxField.addEventListener("keyup", ev => {
        // See if the "Enter" key was hit
        if (ev.keyCode == 13) {
            // Call the click event
            props.onClick ? props.onClick(getValue()) : null;
        }
    });

    // Set the clear click event
    _searchbox._searchBoxClearButton.addEventListener("click", ev => {
        // Disable postback
        ev ? ev.preventDefault() : null;
    });

    // Set the search click event
    _searchbox._container.querySelector(".ms-SearchBox-search").addEventListener("click", ev => {
        // Disable postback
        ev ? ev.preventDefault() : null;

        // Call the click event
        props.onClick ? props.onClick(getValue()) : null;
    });

    // Return the search box
    return {
        get,
        getValue,
        setValue
    };
}
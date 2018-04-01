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

        // See if the value exists
        if (value) {
            // Ensure the 'has-text' class exists
            if (_searchbox._searchBox.className.indexOf("has-text") < 0) {
                // Add the class
                _searchbox._searchBox.className += " has-text";
            }
        } else {
            // See if the 'has-text' class exists
            if (_searchbox._searchBox.className.indexOf("has-text") > 0) {
                // Remove the class
                _searchbox._searchBox.className = _searchbox._searchBox.className.replace(" has-text", "");
            }
        }
    }

    // Add the search box html
    props.el.innerHTML = Templates.SearchBox(props);

    // Create the textfield
    let _searchbox: Fabric.ISearchBox = new fabric.SearchBox(props.el.firstElementChild);

    // Set the blur event
    _searchbox._searchBoxField.addEventListener("blur", ev => {
        // Get the current value
        let value = getValue();
        if (value) {
            // Wait for the box to be cleared
            setTimeout(() => {
                // Update the value
                setValue(value);
            }, 20);
        }
    });

    // Set the key up event
    _searchbox._searchBoxField.addEventListener("keydown", ev => {
        // See if the "Enter" key was hit
        if (ev.keyCode == 13) {
            // Disable panel from closing
            ev ? ev.preventDefault() : null;

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
import { PeoplePicker as Search, SPTypes, Types, Web } from "gd-sprest";
import { fabric } from ".";
import { IPeoplePicker, IPeoplePickerProps } from "./types";

/**
 * People Picker
 */
export const PeoplePicker = (props: IPeoplePickerProps): IPeoplePicker => {
    // Method to get the text field element
    let get = (): HTMLInputElement => {
        // Returns the text field element
        return props.el.querySelector(".ms-PeoplePicker") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the people picker
        return _peoplepicker;
    }

    // Method to get the value
    let getValue = (): Array<Types.SP.ComplexTypes.FieldUserValue> => {
        let value: Array<Types.SP.ComplexTypes.FieldUserValue> = [];

        // Return the value
        return value;
    }

    // Method to render the results
    let renderResults = (searchAll: boolean = false) => {
        // Get the results
        let results = document.querySelector(".ms-PeoplePicker-results");
        if (results) {
            // Clear the results
            results.innerHTML = [
                '<div class="ms-PeoplePicker-resultGroup">',
                '<div class="ms-PeoplePicker-resultGroupTitle">',
                'Users',
                '</div>',
                '</div>',
                '<button class="ms-PeoplePicker-searchMore">',
                '<div class="ms-PeoplePicker-searchMoreIcon">',
                '<i class="ms-Icon ms-Icon--Search"></i>',
                '</div>',
                '<div class="ms-PeoplePicker-searchMoreText">',
                'Search All Users',
                '</div>',
                '</button>'
            ].join('\n');

            // Set the search click event
            (results.querySelector(".ms-PeoplePicker-searchMore") as HTMLButtonElement).onclick = () => {
                // Search all sources
                renderResults(true);

                // Disable postback
                return false;
            }

            // Ensure 2 characters exist
            if (_filterText.length > 1) {
                // Update the search text
                results.querySelector(".ms-PeoplePicker-resultGroupTitle").innerHTML = "Searching for '" + _filterText + "'";

                // Search for the user
                (new Search()).clientPeoplePickerSearchUser({
                    MaximumEntitySuggestions: 15,
                    PrincipalSource: searchAll ? SPTypes.PrincipalSources.All : SPTypes.PrincipalSources.UserInfoList,
                    PrincipalType: props.allowGroups ? SPTypes.PrincipalTypes.All : SPTypes.PrincipalTypes.User,
                    QueryString: _filterText
                }).execute((search) => {
                    let users = [];

                    // Parse the users
                    for (let i = 0; i < search.ClientPeoplePickerSearchUser.length; i++) {
                        let user = search.ClientPeoplePickerSearchUser[i];

                        // Add the user
                        users.push([
                            '<div class="ms-PeoplePicker-result" tabindex="1" data-id="' + user.Key + '">',
                            '<div class="ms-Persona ms-Persona--sm">',
                            '<div class="ms-Persona-details">',
                            '<div class="ms-Persona-primaryText">' + user.DisplayText + '</div>',
                            '<div class="ms-Persona-secondaryText">' + user.EntityData.Email + '</div>',
                            '</div>',
                            '</div>',
                            '<button class="ms-PeoplePicker-resultAction">',
                            '<i class="ms-Icon ms-Icon--Clear"></i>',
                            '</button>',
                            '</div>'
                        ].join('\n'));
                    }

                    // Append the results
                    results.innerHTML = [
                        '<div class="ms-PeoplePicker-resultGroup">',
                        '<div class="ms-PeoplePicker-resultGroupTitle">',
                        'Search Results for \'' + _filterText + '\'',
                        '</div>',
                        '</div>',
                        users.join('\n'),
                        '<button class="ms-PeoplePicker-searchMore">',
                        '<div class="ms-PeoplePicker-searchMoreIcon">',
                        '<i class="ms-Icon ms-Icon--Search"></i>',
                        '</div>',
                        '<div class="ms-PeoplePicker-searchMoreText">',
                        'Search All Users',
                        '</div>',
                        '</button>'
                    ].join('\n');

                    // Add the result click event
                    let userResults = results.querySelectorAll(".ms-PeoplePicker-result");
                    for (let i = 0; i < userResults.length; i++) {
                        (userResults[i] as HTMLDivElement).onclick = (ev) => {
                            // Clear the filter
                            _filterText = "";
                            tb.value = "";

                            // Select the user
                            _peoplepicker._selectResult(ev);
                        };
                    }
                });
            }
        }
    }

    // Add the people picker html
    props.el.innerHTML = [
        '<div class="ms-PeoplePicker">',
        '<label class="ms-Label' + (props.required ? ' is-required' : '') + '" style="display:block">' + (props.label || "") + '</label>',
        '<div class="ms-PeoplePicker-searchBox">',
        '<div class="ms-TextField ms-TextField--textFieldUnderlined">',
        '<input class="ms-TextField-field" type="text" value="" placeholder="User Search"></input>',
        '</div>',
        '</div>',
        '<div class="ms-PeoplePicker-results">',
        '<div class="ms-PeoplePicker-resultGroup">',
        '<div class="ms-PeoplePicker-resultGroupTitle">',
        'Search Users',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('\n');

    // Get the search textbox
    let _filterText = "";
    let tb = get().querySelector(".ms-TextField-field") as HTMLInputElement;
    if (tb) {
        // Add the search event
        tb.onkeyup = () => {
            // Set the filter text
            let filterText = tb.value;
            _filterText = filterText;

            // Wait 500ms before searching
            setTimeout(() => {
                // Ensure the filters match
                if (filterText == _filterText) {
                    // Render the users
                    renderResults();
                }
            }, 500);
        }
    }

    // Create the people picker
    let _peoplepicker = new fabric.PeoplePicker(get());

    // Return the people picker
    return {
        get,
        getFabricComponent,
        getValue
    };
}
import { PeoplePicker as Search, SPTypes, Types, Web } from "gd-sprest";
import { fabric } from ".";
import { Fabric, IPeoplePicker, IPeoplePickerProps } from "./types";

/**
 * People Picker
 */
export const PeoplePicker = (props: IPeoplePickerProps): IPeoplePicker => {
    let _filterText = "";

    // Method to get the component
    let get = () => {
        // Return the people picker
        return _peoplepicker;
    }

    // Method to get the value
    let getValue = (): Array<Types.SP.IPeoplePickerUser> => {
        let users: Array<Types.SP.IPeoplePickerUser> = [];

        // Parse the selected users
        if (_peoplepicker._peoplePickerResults) {
            // Set the value
            for (let i = 0; i < _peoplepicker._peoplePickerResults.length; i++) {
                let result = _peoplepicker._peoplePickerResults[i];

                // Add the user information
                users.push(JSON.parse(result.getAttribute("data-user")));
            }
        }

        // Return the users
        return users;
    }

    // Method to render the results
    let renderResults = (searchAll: boolean = false) => {
        // Get the menu
        let menu = _peoplepicker._peoplePickerMenu;
        if (menu) {
            // Clear the results
            menu.innerHTML = [
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
            (menu.querySelector(".ms-PeoplePicker-searchMore") as HTMLButtonElement).onclick = () => {
                // Search all sources
                renderResults(true);

                // Disable postback
                return false;
            }

            // Ensure 2 characters exist
            if (_filterText.length > 1) {
                // Update the search text
                menu.querySelector(".ms-PeoplePicker-resultGroupTitle").innerHTML = "Searching for '" + _filterText + "'";

                // Search for the user
                (new Search()).clientPeoplePickerSearchUser({
                    MaximumEntitySuggestions: 15,
                    PrincipalSource: searchAll ? SPTypes.PrincipalSources.All : SPTypes.PrincipalSources.UserInfoList,
                    PrincipalType: props.allowGroups ? SPTypes.PrincipalTypes.All : SPTypes.PrincipalTypes.User,
                    QueryString: _filterText
                }).execute((search) => {
                    let users = [];
                    let value = getValue();

                    // Parse the users
                    for (let i = 0; i < search.ClientPeoplePickerSearchUser.length; i++) {
                        let exists = false;
                        let user = search.ClientPeoplePickerSearchUser[i];

                        // Parse the current value
                        for (let j = 0; j < value.length; j++) {
                            // See if this user is already selected
                            if (exists = user.Key == value[j].Key) { break; }
                        }

                        // Ensure the user isn't already selected
                        if (exists) { continue; }

                        // Add the user
                        users.push([
                            '<div class="ms-PeoplePicker-result" tabindex="1" data-user=\'' + JSON.stringify(user) + '\'>',
                            '<div class="ms-Persona ms-Persona--sm">',
                            '<div class="ms-Persona-imageArea"></div>',
                            '<div class="ms-Persona-details">',
                            '<div class="ms-Persona-primaryText">' + user.DisplayText + '</div>',
                            '<div class="ms-Persona-secondaryText">' + user.EntityData.Email + '</div>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join('\n'));
                    }

                    // Append the results
                    menu.innerHTML = [
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

                    // Get the results
                    let results = menu.querySelectorAll(".ms-PeoplePicker-result");
                    for (let i = 0; i < results.length; i++) {
                        // Set the click event
                        results[i].addEventListener("click", (ev) => {
                            let result = ev.currentTarget as HTMLDivElement;

                            // Save the result
                            _peoplepicker._peoplePickerResults = _peoplepicker._peoplePickerResults || [];
                            _peoplepicker._peoplePickerResults.push(result);

                            // Create the persona
                            let persona = document.createElement("div");
                            persona.className = "ms-Persona ms-Persona--token ms-PeoplePicker-persona ms-Persona--xs";
                            persona.innerHTML = (ev.currentTarget as HTMLDivElement).querySelector(".ms-Persona").innerHTML;
                            persona.innerHTML += '<div class="ms-Persona-actionIcon"><i class="ms-Icon ms-Icon--Cancel"></i></div>';
                            persona.setAttribute("data-user", result.getAttribute("data-user"));

                            // Set the click event
                            persona.querySelector(".ms-Persona-actionIcon").addEventListener("click", (ev) => {
                                let userInfo = JSON.parse((ev.currentTarget as HTMLDivElement).parentElement.getAttribute("data-user")) as Types.SP.IPeoplePickerUser;

                                // Parse the results
                                for (let i = 0; i < _peoplepicker._peoplePickerResults.length; i++) {
                                    let result = _peoplepicker._peoplePickerResults[i];
                                    let resultInfo = JSON.parse(result.getAttribute("data-user")) as Types.SP.IPeoplePickerUser;

                                    // See if this is the target user
                                    if (resultInfo.Key == userInfo.Key) {
                                        // Remove this user
                                        _peoplepicker._peoplePickerResults.splice(i, 1);
                                        break;
                                    }
                                }

                                // Remove this persona
                                (ev.currentTarget as HTMLDivElement).parentElement.remove();
                            });

                            // Add the persona
                            _peoplepicker._container.querySelector(".selected-users").appendChild(persona);

                            // Clear the filter
                            _filterText = "";
                            _peoplepicker._peoplePickerSearch.value = "";

                            // Clear the results
                            renderResults();

                            // Close the search dialog
                            _peoplepicker._contextualHostView.disposeModal();
                        });
                    }
                });
            }
        }
    }

    // Add the people picker html
    props.el.innerHTML = [
        '<div class="ms-PeoplePicker">',
        '<label class="ms-Label field-label' + (props.required ? ' is-required' : '') + '" style="display:block">' + (props.label || "") + '</label>',
        '<div class="ms-PeoplePicker-searchBox">',
        '<div class="ms-TextField ms-TextField--textFieldUnderlined">',
        '<input class="ms-TextField-field" type="text" value="" placeholder="User Search"></input>',
        '</div>',
        '</div>',
        '<div class="ms-PeoplePicker-results">',
        '<div class="ms-PeoplePicker-resultGroup">',
        '<div class="ms-PeoplePicker-resultGroupTitle">',
        'Search for users...',
        '</div>',
        '</div>',
        '</div>',
        '<div class="selected-users"></div>',
        '</div>'
    ].join('\n');

    // Create the people picker
    let _peoplepicker: Fabric.IPeoplePicker = new fabric.PeoplePicker(props.el.querySelector(".ms-PeoplePicker"));

    // Add the search event
    _peoplepicker._peoplePickerSearch.addEventListener("keyup", (ev) => {
        // Set the filter text
        let filterText = _peoplepicker._peoplePickerSearch.value;
        _filterText = filterText;

        // Wait 500ms before searching
        setTimeout(() => {
            // Ensure the filters match
            if (filterText == _filterText) {
                // Render the users
                renderResults();
            }
        }, 500);
    });

    // Return the people picker
    return {
        get,
        getValue
    };
}
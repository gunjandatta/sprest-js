import { PeoplePicker as Search, SPTypes, Types, Web } from "gd-sprest";
import { Fabric, IPeoplePicker, IPeoplePickerProps } from "./types";
import { fabric, Spinner, Templates } from ".";

/**
 * People Picker
 */
export const PeoplePicker = (props: IPeoplePickerProps): IPeoplePicker => {
    let _filterText = "";
    let _templates = Templates.PeoplePicker(props);

    // Method to get the component
    let get = () => {
        // Return the people picker
        return _peoplepicker;
    }

    // Method to get the value
    let getValue = (): Array<Types.SP.IPeoplePickerUser> => {
        let users: Array<Types.SP.IPeoplePickerUser> = [];

        // Parse the selected users
        let selectedUsers = _peoplepicker._container ? _peoplepicker._container.querySelectorAll(".ms-Persona") : [];

        // Set the value
        for (let i = 0; i < selectedUsers.length; i++) {
            let userInfo = selectedUsers[i].getAttribute("data-user");

            // Add the user information
            userInfo ? users.push(JSON.parse(userInfo)) : null;
        }

        // Return the users
        return users;
    }

    // Method to render the results
    let renderResults = (ev: Event, searchAll: boolean = false) => {
        let searchDialog = _peoplepicker._contextualHostView._contextualHost;

        // Clear the results
        searchDialog.innerHTML = _templates.group(_filterText.length > 1 ? "Searching for '" + _filterText + "'" : "User Search");

        // Ensure 2 characters exist
        if (_filterText.length > 1) {
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
                    users.push(_templates.result(user));
                }

                // Append the results
                searchDialog.innerHTML = _templates.group(
                    'Search Results for \'' + _filterText + '\'',
                    'Search All Users',
                    users.length == 0 ? '<div class="ms-PeoplePicker-result">Search returned no results</div>' : users.join('\n')
                );

                // See if we have searched all sources
                let btn = _peoplepicker._contextualHostView._contextualHost.querySelector(".ms-PeoplePicker-searchMore") as HTMLButtonElement;
                if (searchAll) {
                    // Hide the button
                    btn.style.display = "none";
                } else {
                    // Set the search click event
                    btn.addEventListener("click", (ev: MouseEvent) => {
                        // Disable postback
                        ev ? ev.preventDefault() : null;

                        // Render the results
                        renderResults(ev, true);
                    });
                }

                // Parse the results
                let results = _peoplepicker._contextualHostView._contextualHost.querySelectorAll(".ms-PeoplePicker-result");
                for (let i = 0; i < results.length; i++) {
                    // Set the click event
                    let personaResult = results[i].querySelector(".ms-Persona");
                    if (personaResult) {
                        personaResult.addEventListener("click", (ev) => {
                            // Clear the filter
                            _filterText = "";
                            _peoplepicker._peoplePickerSearch.value = "";

                            // Get the user information
                            let userInfo = JSON.parse((ev.currentTarget as HTMLDivElement).getAttribute("data-user"));

                            // Add the user
                            _peoplepicker._container.querySelector(".selected-users").innerHTML += _templates.persona(userInfo);

                            // Add the click event
                            let users = _peoplepicker._container.querySelectorAll(".selected-users");
                            users[users.length - 1].querySelector(".ms-Persona-actionIcon").addEventListener("click", ev => {
                                let el = ev.currentTarget as HTMLElement;

                                // Find the persona element
                                while (el && el.className.indexOf("ms-PeoplePicker-persona") < 0) { el = el.parentElement; }

                                // See if the element exists
                                if (el) {
                                    // Remove the element
                                    el.parentElement.removeChild(el);
                                }
                            });

                            // Close the search box
                            _peoplepicker._contextualHostView.disposeModal();
                        });
                    }
                }
            });
        }
    }

    // Add the people picker html
    props.el.innerHTML = [
        '<div class="ms-PeoplePicker">',
        _templates.header(),
        _templates.searchBox(),
        _templates.results("Users", props.value),
        '</div>'
    ].join('\n');

    // Create the people picker
    let _peoplepicker: Fabric.IPeoplePicker = new fabric.PeoplePicker(props.el.querySelector(".ms-PeoplePicker"));

    // Get the personas
    let personas = _peoplepicker._container.querySelectorAll(".ms-PeoplePicker-persona");
    for (let i = 0; i < personas.length; i++) {
        // Add a click event
        personas[i].querySelector(".ms-Persona-actionIcon").addEventListener("click", (ev: MouseEvent) => {
            let el = ev.currentTarget as HTMLElement;

            // Find the persona element
            while (el && el.className.indexOf("ms-PeoplePicker-persona") < 0) { el = el.parentElement; }

            // See if the element exists
            if (el) {
                // Remove the element
                el.parentElement.removeChild(el);
            }
        });
    }

    // Add the search event
    _peoplepicker._peoplePickerSearch.addEventListener("keyup", (ev) => {
        // Set the filter text
        let filterText = _peoplepicker._peoplePickerSearch.value;
        _filterText = filterText;

        // Wait 500ms before searching
        setTimeout((ev) => {
            // Ensure the filters match
            if (filterText == _filterText) {
                // Render the users
                renderResults(ev);
            }
        }, 500);
    });

    // Return the people picker
    return {
        get,
        getValue
    };
}
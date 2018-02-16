import { IPeoplePickerUser } from "gd-sprest/build/mapper/types";
import { Label } from "../templates";
import { IPeoplePickerProps } from "../types";

/**
 * People Picker
 */
export const PeoplePicker = (props: IPeoplePickerProps) => {
    // Group
    let group = (title: string = "", searchText: string = "", results?: string): string => {
        // Return the template
        return [
            '<div class="ms-PeoplePicker-resultGroup">',
            '<div class="ms-PeoplePicker-resultGroupTitle">',
            title,
            '</div>',
            '</div>',
            results ? results : result(),
            '<button class="ms-PeoplePicker-searchMore"' + (searchText ? '' : ' style="display: none;"') + '>',
            '<div class="ms-PeoplePicker-searchMoreIcon">',
            '<i class="ms-Icon ms-Icon--Search"></i>',
            '</div>',
            '<div class="ms-PeoplePicker-searchMoreText">',
            searchText,
            '</div>',
            '</button>',
            '</div>',
        ].join('\n');
    }

    // Header
    let header = (): string => {
        // Return the template
        return Label({ isRequired: props.required, text: props.label });
    }

    // Result
    let result = (user?: IPeoplePickerUser): string => {
        // Ensure the user exists
        if (user) {
            return [
                '<div class="ms-PeoplePicker-result" tabindex="1">',
                '<div class="ms-Persona ms-Persona--sm" data-user=\'' + JSON.stringify(user) + '\'>',
                '<div class="ms-Persona-imageArea"></div>',
                '<div class="ms-Persona-details">',
                '<div class="ms-Persona-primaryText">' + user.DisplayText + '</div>',
                '<div class="ms-Persona-secondaryText">' + user.EntityData.Email + '</div>',
                '</div>',
                '</div>',
                '<button class="ms-PeoplePicker-resultAction" style="display: none;"></button>',
                '</div>'
            ].join('\n');
        }

        // Return an empty persona
        return [
            '<div class="ms-PeoplePicker-result" style="display: none;">',
            '<div class="ms-Persona"></div>',
            '<button class="ms-PeoplePicker-resultAction"></button>',
            '</div>',
        ].join('\n');
    }

    // Results
    let results = (title: string = "", searchText: string = ""): string => {
        // Return the template
        return [
            '<div class="ms-PeoplePicker-results">',
            group(title, searchText),
            '<div class="selected-users"></div>',
        ].join('\n');
    }

    // Search Box
    let searchBox = (): string => {
        // Return the template
        return [
            '<div class="ms-PeoplePicker-searchBox">',
            '<div class="ms-TextField ms-TextField--textFieldUnderlined">',
            '<input class="ms-TextField-field" type="text" value="" placeholder="Search"></input>',
            '</div>',
            '</div>',
        ].join('\n');
    }

    return {
        group,
        header,
        result,
        results,
        searchBox
    }
}
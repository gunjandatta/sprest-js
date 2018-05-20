import { Types } from "gd-sprest";

/**
 * Persona
 */
export const Persona = (props: Types.SP.IPeoplePickerUser): string => {
    // Return the persona
    return [
        '<div class="ms-Persona ms-Persona--token ms-PeoplePicker-persona ms-Persona--xs" data-user=\'' + JSON.stringify(props) + '\'>',
        '<div class="ms-Persona-imageArea"></div>',
        '<div class="ms-Persona-details">',
        '<div class="ms-Persona-primaryText">' + props.DisplayText + '</div>',
        '<div class="ms-Persona-secondaryText">' + ((props.EntityData ? props.EntityData.Email : null) || "") + '</div>',
        '</div>',
        '<div class="ms-Persona-actionIcon">',
        '<i class="ms-Icon ms-Icon--Cancel"></i>',
        '</div>',
        '</div>',
    ].join('\n');
}

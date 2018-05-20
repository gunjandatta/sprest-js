import { IPeoplePickerUser } from "gd-sprest/build/mapper/types";
import { IProps } from "./common";

/**
 * Persona
 */
export interface IPersona { }

/**
 * Persona Props
 */
export interface IPersonaProps extends IProps {
    // The cancel icon click event
    onCancel?: (persona: IPeoplePickerUser) => void;

    // The user information
    userInfo: IPeoplePickerUser;
}

/**
 * Personas Props
 */
export interface IPersonasProps extends IProps {
    // The cancel icon click event
    onCancel?: (persona: IPeoplePickerUser) => void;

    // The user information
    userInfo: Array<IPeoplePickerUser>;
}
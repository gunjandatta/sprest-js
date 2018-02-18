import { ICommandBarProps, ICommandButtonProps } from "../types";
import { CommandButton } from ".";

/**
 * Command Bar
 */
export const CommandBar = (props: ICommandBarProps): string => {
    // Render the button
    let renderButtons = (buttonProps: Array<ICommandButtonProps> = []): string => {
        let buttons = [];

        // Parse the buttons
        for (let i = 0; i < buttonProps.length; i++) {
            // Add the button
            buttons.push(CommandButton(buttonProps[i]));
        }

        // Return the buttons
        return buttons.join('\n');
    }

    // Return the template
    return [
        '<div class="ms-CommandBar ' + (props.className || "") + '">',
        '<div class="ms-CommandBar-sideCommands">',
        renderButtons(props.sideCommands),
        '</div>',
        '<div class="ms-CommandBar-mainArea">',
        renderButtons(props.mainCommands),
        '</div>',
        '</div>'
    ].join('\n');
}
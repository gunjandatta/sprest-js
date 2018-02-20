import { IDatePicker, IDatePickerProps, IDropdownOption } from "./types"
import { fabric, Dropdown, Templates } from ".";

/**
 * Time Picker Type
 */
export enum TimePickerType {
    Default = 0,
    Military = 1
}

/**
 * Date Picker
 */
export const DatePicker = (props: IDatePickerProps): IDatePicker => {
    // Method to get the date picker element
    let getDate = (): HTMLInputElement => {
        // Returns the datetime element
        return props.el.querySelector(".ms-DatePicker") as HTMLInputElement;
    }

    // Method to get the time picker element
    let getTime = (): HTMLInputElement => {
        // Returns the datetime element
        return props.el.querySelector(".ms-TimePicker") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the date picker
        return _dp;
    }

    // Method to get the value
    let getValue = (): Date => {
        let dt: Date = null;

        // Get the date value
        let dtValue = _dp.picker.get();
        if (dtValue) {
            // Set the date
            dt = new Date(dtValue);
        }

        // See if the time exists
        let timeValue: any = _tp ? _tp.getOption() : null;
        timeValue = timeValue ? timeValue.value.split(" ") : null;
        if (timeValue) {
            // Set the time
            // Set the hours
            let hours = parseInt(timeValue[0].split(":")[0])
            hours += timeValue[1] == "PM" ? 12 : 0;

            // Set the minutes
            let minutes = parseInt(timeValue[0].split(":")[1]);

            // Set the time value
            dt.setHours(hours);
            dt.setMinutes(minutes);
        }

        // Return the date
        return dt;
    }

    // Method to render the date picker
    let renderDatePicker = (el: HTMLElement) => {
        // Add the datetime html
        el.innerHTML = Templates.DatePicker(props);

        // Set the date picker change event
        el.onchange = () => {
            // Execute the change event
            props.onChange ? props.onChange(getValue()) : null;
        }

        // Create the date picker
        return new fabric.DatePicker(el);
    }

    // Method to render the time picker
    let renderTimePicker = (el: HTMLElement) => {
        // Render the options
        let options: Array<IDropdownOption> = [];

        // Create the hours
        for (let i = 0; i < 25; i++) {
            let hour = "";

            // See if this is military time
            if (props.timePickerType == TimePickerType.Military) {
                // Set the hour
                hour = ("0" + i).slice(-2);
            } else {
                // Set the hour
                if (i == 0 || i == 12) {
                    hour = "12";
                } else {
                    hour = ("0" + (i % 12)).slice(-2);
                }
            }
            // Create the minutes
            for (let j = 0; j < 4; j++) {
                let min = ("0" + (j * 15)).slice(-2);

                // See if this is not military time
                if (props.timePickerType != TimePickerType.Military) {
                    min += " " + (i < 12 ? "AM" : "PM");
                }

                // Add the option
                options.push({
                    text: hour + ":" + min,
                    value: hour + ":" + min
                });
            }
        }

        // Render a dropdown
        return Dropdown({
            el,
            label: "Time",
            options
        });
    }

    // Add the date picker
    props.el.innerHTML = [
        '<div class="ms-DatePicker"></div>',
        props.showTime ? '<div class="ms-TimePicker"></div>' : ''
    ].join('\n');

    // Render the date picker
    let _dp = renderDatePicker(props.el.children[0] as HTMLElement);

    // Render the time picker
    let _tp = props.showTime ? renderTimePicker(props.el.children[1] as HTMLElement) : null;

    // Return the date picker
    return {
        getDate,
        getTime,
        getFabricComponent,
        getValue
    };
}

import { Fabric, IDatePicker, IDatePickerProps, IDropdown, IDropdownOption } from "./types"
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
        // Get the date value
        let dt = _dp ? new Date(_dp.picker.get()) : null;
        if (dt) {
            // See if the time exists
            let timeValue: IDropdownOption | Array<string> = _tp ? _tp.getValue() as IDropdownOption : null;
            timeValue = timeValue && timeValue.value ? timeValue.value.split(" ") : null;
            if (timeValue) {
                let timeInfo = timeValue[0].split(":");

                // Set the hours
                let hours = parseInt(timeInfo[0])
                hours += hours < 12 && timeValue[1] == "PM" ? 12 : 0;
                dt.setHours(hours);

                // Set the minutes
                dt.setMinutes(parseInt(timeInfo[1]));
            }
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
        let dp = new fabric.DatePicker(el) as Fabric.IDatePicker;

        // See if a value exists
        if (props.value) {
            let dt = new Date(props.value);

            // Set the date
            dp.picker.set("select", [dt.getFullYear(), dt.getMonth(), dt.getDate()])
        }

        // Return the date picker
        return dp;
    }

    // Method to render the time picker
    let renderTimePicker = (el: HTMLElement) => {
        // Render the options
        let options: Array<IDropdownOption> = [];

        // Create the hours
        for (let i = 0; i < 24; i++) {
            let hour = "";

            // See if this is military time
            if (props.timePickerType == TimePickerType.Military) {
                // Set the hour
                hour = ("0" + i).slice(-2);
            } else {
                // Set the hour
                hour = i % 12 == 0 ? "12" : ("0" + (i % 12)).slice(-2);
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

        // See if a value exists
        let value = null;
        if (props.value) {
            let dt = new Date(props.value);
            let time = dt.toTimeString().split(' ')[0].split(':');

            // Set the hours, minutes and format
            let hours: number | string = parseInt(time[0]);
            let mins = ("0" + parseInt(time[1])).slice(-2);
            let format = hours > 11 ? "PM" : "AM";

            // Update the hours based on the time picker type
            hours -= hours > 12 && props.timePickerType != TimePickerType.Military ? 12 : 0;
            hours = ("0" + hours).slice(-2);

            // Set the time value
            value = hours + ":" + mins + " " + format;
        }

        // Render a dropdown
        return Dropdown({
            el,
            label: "Time",
            options,
            value
        });
    }

    // Add the date picker
    props.el.innerHTML = [
        '<div class="ms-DatePicker"></div>',
        props.showTime ? '<div class="ms-TimePicker"></div>' : ''
    ].join('\n');

    // Render the date picker
    let _dp: Fabric.IDatePicker = renderDatePicker(props.el.children[0] as HTMLElement);

    // Render the time picker
    let _tp: IDropdown = props.showTime ? renderTimePicker(props.el.children[1] as HTMLElement) : null;

    // Add a click event to the date picker input
    _dp.picker.on({
        "open": () => {
            // Get the date picker
            let dp = _dp.picker.$root[0].children[0];

            // Wait for the date picker to be visible
            let ctr = 0;
            let id = setInterval(() => {
                let pos = dp.getBoundingClientRect();
                if (pos.top > 0) {
                    // Clear the interval
                    clearInterval(id);

                    // See if the date picker is visible
                    let offset = document.body.clientHeight - (pos.top + pos.height);
                    if (offset < 0) {
                        // Ensure the date picker is visible
                        dp.scrollIntoView(false);
                    }
                }
                // See if we have exceeded the max attempts
                else if (++ctr > 5) {
                    // Clear the interval
                    clearInterval(id);
                }
            }, 100);
        }
    });

    // Return the date picker
    return {
        getDate,
        getTime,
        getFabricComponent,
        getValue
    };
}

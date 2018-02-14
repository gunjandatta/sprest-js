import { IDatePicker, IDatePickerProps, IDropdownOption } from "./types"
import { fabric, Dropdown } from ".";

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
        // Get the datetime value
        // TO DO
        return null;
    }

    // Method to render the date picker
    let renderDatePicker = (el: HTMLElement) => {
        // Add the datetime html
        el.innerHTML = [
            '<div class="ms-TextField">',
            '<label class="ms-Label field-label">' + (props.label || '') + '</label>',
            '<i class="ms-DatePicker-event ms-Icon ms-Icon--Event"></i>',
            '<input class="ms-TextField-field" type="text" placeholder="Select a date&hellip;">',
            '</div>',
            '<div class="ms-DatePicker-monthComponents">',
            '<span class="ms-DatePicker-nextMonth js-nextMonth"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>',
            '<span class="ms-DatePicker-prevMonth js-prevMonth"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span>',
            '<div class="ms-DatePicker-headerToggleView js-showMonthPicker"></div>',
            '</div>',
            '<span class="ms-DatePicker-goToday js-goToday">Go to today</span>',
            '<div class="ms-DatePicker-monthPicker">',
            '<div class="ms-DatePicker-header">',
            '<div class="ms-DatePicker-yearComponents">',
            '<span class="ms-DatePicker-nextYear js-nextYear"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>',
            '<span class="ms-DatePicker-prevYear js-prevYear"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span>',
            '</div>',
            '<div class="ms-DatePicker-currentYear js-showYearPicker"></div>',
            '</div>',
            '<div class="ms-DatePicker-optionGrid">',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="0">Jan</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="1">Feb</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="2">Mar</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="3">Apr</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="4">May</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="5">Jun</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="6">Jul</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="7">Aug</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="8">Sep</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="9">Oct</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="10">Nov</span>',
            '<span class="ms-DatePicker-monthOption js-changeDate" data-month="11">Dec</span>',
            '</div>',
            '</div>',
            '<div class="ms-DatePicker-yearPicker">',
            '<div class="ms-DatePicker-decadeComponents">',
            '<span class="ms-DatePicker-nextDecade js-nextDecade"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>',
            '<span class="ms-DatePicker-prevDecade js-prevDecade"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span> ',
            '</div>',
            '</div>'
        ].join('\n');

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

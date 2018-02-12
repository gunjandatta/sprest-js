import { IDatePicker, IDatePickerProps } from "./types"
import { fabric } from ".";

/**
 * Date Picker
 */
export const DatePicker = (props: IDatePickerProps): IDatePicker => {
    let _dt = null;

    // Method to get the datetime element
    let get = (): HTMLInputElement => {
        // Returns the datetime element
        return props.el.querySelector(".ms-DatePicker") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the datetime
        return _dt;
    }

    // Method to get the value
    let getValue = (): boolean => {
        // Get the datetime value
        return _dt ? _dt.getValue() : false;
    }

    // Add the datetime html
    props.el.innerHTML = [
        '<div class="ms-DatePicker">',
        '<div class="ms-TextField">',
        '<label class="ms-Label">' + (props.label || '') + '</label>',
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
        '</div>',
        '</div>'
    ].join('\n');

    // Get the date picker
    let dt = get();

    // Set the date picker change event
    dt.onchange = () => {
        // Execute the change event
        props.onChange ? props.onChange(_dt.getValue()) : null;
    }

    // Create the date picker
    _dt = new fabric.DatePicker(dt);

    // Return the date picker
    return {
        get,
        getFabricComponent,
        getValue
    };
}

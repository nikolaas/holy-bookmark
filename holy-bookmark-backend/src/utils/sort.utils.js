import moment from "moment";
import { DATE_FORMATS } from "../utils/date.utils";
import { isString } from "./lang.utils";

function compareBoolean(val1, val2) {
    if (val1 === val2) {
        return 0;
    }
    if (val1 && !val2) {
        return 1;
    }
    return -1;
}

const normalizeDate = (date, options = {}) => {
    if (isString(date)) {
        return moment(date, options.dateFormat || DATE_FORMATS.COMMON).toDate();
    }
    return moment(date).toDate();
};

function compareDates(date1, date2) {
    if (date1 == date2) {
        return 0;
    }
    if (date1 > date2) {
        return 1;
    }
    return -1;
}

const SORTERS = {
    'string': {
        ascending: () => (value1, value2) => {
            return value1.localeCompare(value2);
        },
        descending: () => (value1, value2) => {
            return value2.localeCompare(value1);
        },
    },
    'number': {
        ascending: () => (value1, value2) => {
            return value1 - value2;
        },
        descending: () => (value1, value2) => {
            return value2 - value1;
        },
    },
    'boolean': {
        ascending: () => (value1, value2) => {
            return compareBoolean(value1, value2);
        },
        descending: () => (value1, value2) => {
            return compareBoolean(value2, value1);
        },
    },
    'date': {
        ascending: options => {
            return (value1, value2) => {
                return compareBoolean(normalizeDate(value1, options), normalizeDate(value2, options));
            }
        },
        descending: options => {
            return (value1, value2) => {
                return compareDates(normalizeDate(value2, options), normalizeDate(value1, options));
            }
        },
    }
};

const createAscendingSorter = (type, options) => SORTERS[type].ascending(options);

const createDescendingSorter = (type, options) => SORTERS[type].descending(options);

export function createSorter(prop, type, order, options) {
    const propSorter = order === 'asc' ? createAscendingSorter(type, options) : createDescendingSorter(type, options);
    return (object1, object2) => {
        const value1 = object1[prop];
        const value2 = object2[prop];
        if (value1 == null && value2 == null) {
            return 0;
        }
        if (value1 != null && value2 == null) {
            return 1;
        }
        if (value1 == null && value2 != null) {
            return -1;
        }
        return propSorter(value1, value2);
    };
}

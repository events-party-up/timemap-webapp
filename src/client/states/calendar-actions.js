import moment from 'moment';
import {getDirection as getDirectionFormAPI} from 'api/mapboxAPI.js';
import {addEvent as addEventFormAPI} from 'api/calendarAPI.js';
export function addEventStart() {
    return {
        type: '@CALENDAR/ADD_EVENT_START'
    };
}
export function addEventEnd(event) {
    return {
        type: '@CALENDAR/ADD_EVENT_END',
        event
    };
}

export function addEvent(event) {
    return (dispatch) => {
        dispatch(addEventStart());
        return addEventFormAPI(event).then((data) => {
            dispatch(addEventEnd(data));
            dispatch(updateEventInfo(data.id));
        }).
        catch(() => {
            console.error("Can't add event to server");
        });
    };
}

export function setEvent(id, key, value) {
    return {
        type: '@CALENDAR/SET_EVENT',
        id,
        key,
        value
    };
}

function updateNextEventStart(){
    return {
        type: '@CALENDAR/UPDATE_NEXT_EVENT_START'
    };
}

function updateNextEventEnd(event){
    return {
        type: '@CALENDAR/UPDATE_NEXT_EVENT_END',
        event
    };
}

export function updateNextEvent(){
    return (dispatch, getState) => {
        dispatch(updateNextEventStart());
        let {geolocation, trans} = getState().calendar.nextEvent;
        if(!geolocation||!trans)throw Error("can't find event");
        return getDirectionFormAPI(getState().map.currentPosition, geolocation, trans, getState().map.accessToken).then((data) => {
            let event = JSON.parse(JSON.stringify(getState().calendar.nextEvent));
            event.duration = data.duration;
            event.distance = data.distance;
            dispatch(updateNextEventEnd(event));
        });
    };
}

export function setMonth(month){
    return {
        type: '@CALENDAR/SET_MONTH',
        month
    };
}

export function setYear(year){
    return {
        type: '@CALENDAR/SET_YEAR',
        year
    };
}

export function updateMonthNumbers(year, month){
    let monthNumbers = [];
    let m = moment({
        year,
        month: month-1,
        date: 1
    });
    var firstDay = m.day();
    for(let i=0;i<m.daysInMonth();i++){
        monthNumbers[i+firstDay]=i+1;
    }
    return {
        type: '@CALENDAR/UPDATE_MONTH_NUMBERS',
        monthNumbers
    };
}

import {getDirection as getDirectionFormAPI} from 'api/mapboxAPI.js';
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
        return new Promise((resolve, reject) => {
            //postEvent
            dispatch(addEventEnd(event));
            resolve(event);
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

function updateEventInfoStart(){
    return {
        type: '@CALENDAR/UPDATE_EVENT_INFO_START'
    };
}

function updateEventInfoEnd(){
    return {
        type: '@CALENDAR/UPDATE_EVENT_INFO_START'
    };
}

export function updateEventInfo(id){
    return (dispatch, getstate) => {
        dispatch(updateEventInfoStart());
        let geolocation = null;
        let trans = 'walking';
        for(let event of getstate().calendar.events){
            if(id === event.id){
                geolocation = event.geolocation;
                trans = event.trans;
                break;
            }
        }
        if(!geolocation)throw Error("can't find event");
        if(!trans)trans = 'walking';
        return getDirectionFormAPI(getstate().map.currentPosition, geolocation, trans, getstate().map.accessToken).then((res) => {
            dispatch(setEvent(id, 'duration', res.duration));
            dispatch(setEvent(id, 'distance', res.distance));
            dispatch(updateEventInfoEnd());
        });
    };
}

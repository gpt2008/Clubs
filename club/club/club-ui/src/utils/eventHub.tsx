class EventHub {
    private callbackLists = {} as any;
    public trigger = (eventName: Event, data?: any) => {
        const callbackList = this.callbackLists[eventName];
        if (!callbackList) {
            return;
        }

        Object.keys(callbackList).forEach(callbackRef => {
            const callbackFunc = callbackList[callbackRef];
            callbackFunc(data);
        });
    }

    public on = (eventName: Event, callback: any): string => {
        if (!this.callbackLists[eventName]) {
            this.callbackLists[eventName] = {};
        }
        const callbackRef = String(Math.round(Math.random() * 10000));
        this.callbackLists[eventName][callbackRef] = callback;
        return callbackRef;
    }

    public off = (callbackRef?: string) => {
        if (!callbackRef) {
            return;
        }

        Object.keys(this.callbackLists).forEach(eventName => {
            const callbackList = this.callbackLists[eventName];
            if (!callbackList) {
                return;
            }

            delete callbackList[callbackRef];
        });
    }
}

export enum Event {
    LOADING_ON,
    LOADING_OFF,
    SELECTED_ORGANIZATION_CHANGED,
    CALENDAR_TAB_ACTIVE,
    OPEN_PROVIDER_CALENDAR,
    GROUP_CALENDAR_TAB_ACTIVE,
}

export default new EventHub();

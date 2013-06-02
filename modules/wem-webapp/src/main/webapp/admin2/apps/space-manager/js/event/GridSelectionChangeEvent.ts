module APP.event {

    export class GridSelectionChangeEvent extends SpaceModelEvent {
        constructor(model:APP.model.SpaceModel[]) {
            super('gridChange', model);
        }

        static on(handler:(event:GridSelectionChangeEvent) => void) {
            API_event.onEvent('gridChange', handler);
        }
    }
}

module api.form.inputtype {

    export interface InputTypeViewNotManagingAdd<RAW_VALUE_TYPE> extends InputTypeView<RAW_VALUE_TYPE> {


        createAndAddOccurrence();


        maximumOccurrencesReached():boolean;


        onOccurrenceAdded(listener: (event: api.form.OccurrenceAddedEvent)=>void);


        onOccurrenceRemoved(listener: (event: api.form.OccurrenceRemovedEvent)=>void);


        unOccurrenceAdded(listener: (event: api.form.OccurrenceAddedEvent)=>void);


        unOccurrenceRemoved(listener: (event: api.form.OccurrenceRemovedEvent)=>void)

    }
}
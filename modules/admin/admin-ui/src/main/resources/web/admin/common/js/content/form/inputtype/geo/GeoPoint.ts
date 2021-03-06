module api.content.form.inputtype.geo {

    import support = api.form.inputtype.support;

    import ValueTypes = api.data.ValueTypes;
    import ValueType = api.data.ValueType;
    import Value = api.data.Value;
    import Property = api.data.Property;

    // TODO: GeoPoint is not dependent on the content domain and should therefore be moved to api.form.inputtype.geo
    export class GeoPoint extends support.BaseInputTypeNotManagingAdd<api.util.GeoPoint> {

        constructor(config: api.form.inputtype.InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.GEO_POINT;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.GEO_POINT.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): api.dom.Element {
            if (!ValueTypes.GEO_POINT.equals(property.getType())) {
                property.convertValueType(ValueTypes.GEO_POINT);
            }

            let geoPoint = new api.ui.geo.GeoPoint(property.getGeoPoint());

            geoPoint.onValueChanged((event: api.ValueChangedEvent) => {
                let value = api.util.GeoPoint.isValidString(event.getNewValue()) ?
                            ValueTypes.GEO_POINT.newValue(event.getNewValue()) :
                            ValueTypes.GEO_POINT.newNullValue();
                this.notifyOccurrenceValueChanged(geoPoint, value);
            });

            return geoPoint;
        }

        updateInputOccurrenceElement(occurrence: api.dom.Element, property: api.data.Property, unchangedOnly: boolean) {
            let geoPoint = <api.ui.geo.GeoPoint> occurrence;

            if (!unchangedOnly || !geoPoint.isDirty()) {
                geoPoint.setGeoPoint(property.getGeoPoint());
            }
        }

        resetInputOccurrenceElement(occurrence: api.dom.Element) {
            let input = <api.ui.geo.GeoPoint> occurrence;

            input.resetBaseValues();
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.GEO_POINT);
        }

        hasInputElementValidUserInput(inputElement: api.dom.Element) {
            let geoPoint = <api.ui.geo.GeoPoint>inputElement;
            return geoPoint.isValid();
        }
    }

    api.form.inputtype.InputTypeManager.register(new api.Class('GeoPoint', GeoPoint));
}

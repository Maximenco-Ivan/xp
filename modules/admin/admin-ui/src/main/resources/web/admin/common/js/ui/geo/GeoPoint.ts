import {TextInput} from "../text/TextInput";
import {GeoPoint as GeoPointUtil} from "../../util/GeoPoint";
import {_i18n} from "../../i18n/Messages";
import {ValueChangedEvent} from "../../ValueChangedEvent";
import {StringHelper} from "../../util/StringHelper";

export class GeoPoint extends TextInput {

        private validUserInput: boolean;

        constructor(originalValue?: GeoPointUtil) {
            super("geo-point", undefined, originalValue ? originalValue.toString() : undefined);

            this.validUserInput = true;
            this.getEl().setAttribute("title", "latitude,longitude");
            this.setPlaceholder(_i18n('latitude,longitude'));

            this.onValueChanged((event: ValueChangedEvent) => {
                var typedGeoPoint = this.getValue();
                this.validUserInput = StringHelper.isEmpty(typedGeoPoint) ||
                                      GeoPointUtil.isValidString(typedGeoPoint);

                this.updateValidationStatusOnUserInput(this.validUserInput);
            });
        }

        setGeoPoint(value: GeoPointUtil): GeoPoint {
            this.setValue(value ? value.toString() : "");
            return this;
        }

        getGeoPoint(): GeoPointUtil {
            var value = this.getValue();
            if (StringHelper.isEmpty(value)) {
                return null;
            }
            return <GeoPointUtil> GeoPointUtil.fromString(value);
        }

        isValid(): boolean {
            return this.validUserInput;
        }

    }

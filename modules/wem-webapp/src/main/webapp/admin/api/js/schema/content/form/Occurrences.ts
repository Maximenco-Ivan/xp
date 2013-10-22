module api_schema_content_form{


    export class Occurrences {

        private minimum:number;
        private maximum:number;

        constructor(json) {
            this.minimum = json.minimum;
            this.maximum = json.maximum;
        }

        getMaximum():number {
            return this.maximum;
        }

        getMinimum():number {
            return this.minimum;
        }

        minimumReached(occurrenceCount:number) {
            return occurrenceCount > this.minimum;
        }

        maximumReached(occurrenceCount:number):boolean {
            if (this.maximum == 0) {
                return false;
            }
            return occurrenceCount >= this.maximum;
        }

        public toJson():api_schema_content_form_json.OccurrencesJson {

            return <api_schema_content_form_json.OccurrencesJson>{
                maximum : this.getMaximum(),
                minimum : this.getMinimum()
            };
        }
    }
}
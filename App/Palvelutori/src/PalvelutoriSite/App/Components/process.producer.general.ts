/// <reference path="../../typings/pikaday/pikaday.d.ts" />

namespace Palvelutori {

    class ProcessProducerGeneralController {
        /**
         * Timeslots for the ui.
         */
        public timeSlots: ITimeSlot[] = [];

        public isCalendarVisible: boolean = false;

        static $inject = ["ptSearchData", "ptScrolling"];

        public searchOk: boolean;

        constructor(
            public searchData: SearchDataService,
            private ptScrolling: ScrollingService) {
            this.timeSlots = Palvelutori.timeSlots;
            this.initDatePicker();
        }

        public isShowSearchResultsButtonVisible(): boolean {
            var self = this;
            if (self.searchOk && self.searchData.data.aika && self.searchData.data.paiva) {
                if (self.searchData.latestSearchResults && self.searchData.latestSearchResults.length > 0) {
                    return true;
                }                
            }
            return false;
        }

        public isShowNoSearchResultsBannerVisible(): boolean {
            var self = this;
            if (self.searchOk && self.searchData.data.aika && self.searchData.data.paiva) {
                if (self.searchData.latestSearchResults && self.searchData.latestSearchResults.length === 0) {
                    return true;
                }
            }
            return false;
        }

        public searchResultsCount(): number {
            var self = this;
            if (self.searchData.latestSearchResults) {
                return self.searchData.latestSearchResults.length;
            }
            return 0;
        }

        public showSearchResults() {
            var self = this;
            self.ptScrolling.scrollTo('search-results');
        }

        /**
         * Initializes the datepicker control.
         */
        private initDatePicker() {
            var picker = new Pikaday({
                field: document.getElementById('process.producer.general.datepicker'),
                container: document.getElementById('process.producer.general.datepicker-container'),
                format: 'DD.MM.YYYY',
                onSelect(date: Date) {
                },
                firstDay: 1,
                i18n: this.getI18nForDatePicker()
            });

            var hideFun = picker.hide;
            picker.hide = function () {/*noop*/ }

            picker.show();            
        }

        /**
         * i18n internalization for the datepicker control.
         */
        private getI18nForDatePicker(): Pikaday.PikadayI18nConfig {
            var conf: Pikaday.PikadayI18nConfig;

            conf = {
                previousMonth: 'Edellinen kuukausi',
                nextMonth: 'Seuraava kuukausi',
                months: ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'],
                weekdays: ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
                weekdaysShort: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
            };

            if (Palvelutori.languagePrefix === 'sv') {
                conf = {
                    previousMonth: 'Edellinen kuukausi',
                    nextMonth: 'Seuraava kuukausi',
                    months: ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'],
                    weekdays: ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
                    weekdaysShort: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
                };                
            }

            return conf;
        }

    }

    app.component("ptProcessProducerGeneral", {
        transclude: true,
        bindings: {
            searchData: '=',
            searchOk: '<'
        },
        templateUrl: () => getUrl('/Components/ProcessProducerGeneral'),
        controller: ProcessProducerGeneralController
    });
}
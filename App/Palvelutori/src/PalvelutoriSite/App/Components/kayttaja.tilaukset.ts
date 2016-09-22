namespace Palvelutori {
    interface ITilausInfo {
        id: string;
        yritys: string;
        palvelu_pvm: string;
        palvelu_aika: string;
        arvio?: number;
        can_be_rated: boolean;
    }

    interface ITilaus {
        id: string;
        company: string;
        timeslot_start: string;
        timeslot_end: string;
        rating?: number;
        can_be_rated: boolean;
    }

    class KayttajaTilauksetController {
        tulevat: ITilausInfo[];
        menneet: ITilausInfo[];
        tilaukset: ITilaus[];
        yritykset: { [idx: string]: IYritys };
        static $inject = ["bfDataService"];
        constructor(private _dataService: BusinessForms.BFDataService) {
            this.yritykset = {};
            this.tulevat = [];
            this.menneet = [];
        }

        $onInit() {
            var self = this;
            self._dataService.query<IYritys>('search/companies').then(yritykset => {
                for (var yritys of yritykset) {
                    self.yritykset[yritys.id] = yritys;
                }
                self.fillRows();
            });
        }

        private fillRows() {
            var dtNow = (new Date()).toISOString();
            for (var tilaus of this.tilaukset) {
                var info: ITilausInfo = {
                    id: tilaus.id,
                    yritys: this.yritykset[tilaus.company].name,
                    palvelu_pvm: this.parseDate(tilaus.timeslot_start),
                    palvelu_aika: this.parseTime(tilaus.timeslot_start) + " - " + this.parseTime(tilaus.timeslot_end),
                    arvio: tilaus.rating,
                    can_be_rated: tilaus.can_be_rated
                };

                if (dtNow > tilaus.timeslot_end) {
                    this.menneet.push(info);
                } else {
                    this.tulevat.push(info);
                }
            }
        }

        private parseDate(dt: string) {
            var date = new Date(Date.parse(dt));
            return date.getUTCDate() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCFullYear();
        }

        private parseTime(dt: string) {
            var date = new Date(Date.parse(dt));
            var min = date.getUTCMinutes();
            if (min < 10) {
                return date.getUTCHours() + ":0" + min;
            }
            return date.getUTCHours() + ":" + min;
        }
    }

    app.component('ptKayttajanTilaukset', {
        bindings: {
            tilaukset: '<'
        },
        templateUrl: getUrl('/Components/KayttajaTilaukset'),
        controller: KayttajaTilauksetController
    });
}
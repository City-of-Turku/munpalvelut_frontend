namespace Palvelutori {
    class ProcessConfirmGeneralController {

        public price: string = null;
        public description: string = null;
        public smallImageUrl: string = null;

        static $inject = ["$location", "ptSearchData", "bfDataService"];

        constructor(private _location: ng.ILocationService, public searchData: SearchDataService, private _dataService: BusinessForms.BFDataService) {
            this.init();
        }

        private init() {
            this.price = this.searchData.calcPrice(this.searchData.data.yritys);
            this.description = this.searchData.data.yritys.description[Palvelutori.languagePrefix];
            this.smallImageUrl = "images/mun_palvelut_siivouspalvelu_placeholder-04.png";
        }

        public confirm() {
            var self = this;
            this._dataService.postItem('kayttajaTilaus/create/' + this.searchData.data.me.id, this.searchData.data).then(ok => {
                if (!ok) {
                    return false;
                }
                this._location.path('/process/summary');
            });
        }
    }
    app.component("ptProcessConfirmGeneral", {
        bindings: {
            kayttaja: '<',
            kohde: '<',
            searchData: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessConfirmGeneral'),
        controller: ProcessConfirmGeneralController
    });
}
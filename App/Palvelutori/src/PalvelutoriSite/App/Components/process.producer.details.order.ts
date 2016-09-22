namespace Palvelutori {
    class ProcessProducerDetailsOrderController {

        public price: string = null;
        public packageTitle: string = null;
        public date: string = null;
        public time: string = null;
        public extras: string[] = [];
        public info: string = null;

        static $inject = ["ptSearchData", "$location", "ptLogin"];

        constructor(public searchData: SearchDataService, private _location: ng.ILocationService, private _login: LoginService) {
            this.init();
        }

        private init() {
            this.price = this.searchData.calcPrice(this.searchData.data.yritys);

            this.packageTitle = this.searchData.data.paketti.title[Palvelutori.languagePrefix];

            this.date = this.searchData.data.paiva;

            if (Palvelutori.languagePrefix === 'sv') {
                this.time = this.searchData.data.aika.nameSv;
            } else {
                this.time = this.searchData.data.aika.nameFi;
            }

            if (this.searchData.data.lisatiedot) {
                this.info = this.searchData.data.lisatiedot;                
            }
        }

        public confirm() {
            if (this._login.isLoggedIn) {
                this._location.path('/process/confirm');
            } else {
                this._login.pendingReturn = '/process/confirm';
                this._location.path('/show/login');
            }
        }
    }

    app.component("ptProcessProducerDetailsOrder", {
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessProducerDetailsOrder'),
        controller: ProcessProducerDetailsOrderController
    });
}
namespace Palvelutori {

    interface IFaderImage {
        src: string;
        alt: string;
    }

    class ProcessProducerDetailsGeneralController {
        
        public pricePerHour: string = null;
        public price: string = null;
        public description: string = null;
        public wwwsite: string = null;
        public videourl: string = null;
        public hasImages: boolean = false;
        public osoite1: string;
        public osoite2: string;
        public osoitekaupunki: string;
        static $inject = ["$scope", "ptSearchData", "bfDataService"];

        constructor(
            public $scope: ng.IScope,
            public searchData: SearchDataService,
            private _dataService: BusinessForms.BFDataService) {

            this.init();
        }

        onLisatietoja() {
            return this.wwwsite && true;
        }

        private init() {
            var self = this;

            self.pricePerHour = self.searchData.getPricePerHourFormatted(self.searchData.data.yritys);
            self.price = self.searchData.calcPrice(self.searchData.data.yritys);
            self.description = self.searchData.data.yritys.description[Palvelutori.languagePrefix];

            // Links
            if (self.searchData.data.yritys.links) {
                for (var link of self.searchData.data.yritys.links) {
                    if (link.linktype == 'web') {
                        if (link.url.length > 4 && link.url.substr(0, 4) == 'http') {
                            self.wwwsite = link.url;
                        } else {
                            self.wwwsite = "http://" + link.url;
                        }
                    }
                    if (link.linktype == 'youtube') {
                        self.videourl = link.url;
                    }
                }
            }

            if (self.searchData.data.yritys.addresses && self.searchData.data.yritys.addresses.length > 0) {
                var addr = self.searchData.data.yritys.addresses[0];
                this.osoite1 = addr.streetAddress;
                if (addr.streetAddress2) {
                    this.osoite1 += ", " + addr.streetAddress2;
                }
                this.osoite1 += ", " + addr.postalcode + ' ' + addr.city;
            }

            // Images
            self._dataService.query<IKuva>('yritysKuvat/' + self.searchData.data.yritys.id).then(data => {
                if (data) {
                    var images: IFaderImage[] = [];

                    for (let i = 0; i < data.length; i++) {
                        var image: string = data[i].url;
                        var idx: number = image.lastIndexOf('/');
                        var tmp: string = "/api/Image/" + image.substr(idx + 1);
                        var faderImage: IFaderImage = { src: tmp, alt: 'img' };
                        images.push(faderImage);
                        self.hasImages = true;
                    }

                    var scope: any = self.$scope;
                    scope.images = images;
                }
            });            
        }

    }

    app.component("ptProcessProducerDetailsGeneral", {
        transclude: true,
        templateUrl: () => getUrl('/Components/ProcessProducerDetailsGeneral'),
        controller: ProcessProducerDetailsGeneralController
    });
}
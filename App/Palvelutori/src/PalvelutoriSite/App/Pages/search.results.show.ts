namespace Palvelutori {
    class ShowSearchResultsController {
        static $inject = ["$http", "bfErrorService", "bfDataService", "ptSearchData"];

        private images: { [id: string]: string } = {};
        private showMoreItems : IFreeSearchResultItem[] = [];

        constructor(
            private $http: ng.IHttpService,
            private errorService: BusinessForms.BFErrorService,
            private dataService: BusinessForms.BFDataService,
            public searchData: SearchDataService) {
        }

        public search() {
            var self = this;

            if (!self.searchData.freeSearchKey || self.searchData.freeSearchKey === null || self.searchData.freeSearchKey.trim().length === 0) {
                return;
            }

            self.$http.post<string>('/api/YritysSearch/searchFromCompanies', JSON.stringify(self.searchData.freeSearchKey))
                .then(data => {
                    self.searchData.notifyFreeSearchResultsChanged(self.transform(data.data));
                })
                .catch(error => self.errorService.showError('searchFromCompanies', error));
        }

        private transform(results: any): IFreeSearchResultItem[] {
            var items: IFreeSearchResultItem[] = [];
            for (let i = 0; i < results.length; i++) {
                var item: IFreeSearchResultItem = { company: results[i] };
                items.push(item);
            }
            return items;
        }

        public getDescription(item: IFreeSearchResultItem) : string {
            var s = item.company.description[Palvelutori.languagePrefix];
            return s;
        }       

        public getAddress(item: IFreeSearchResultItem): string {
            var s: string = '';
            if (item.company.addresses && item.company.addresses.length > 0) {
                var addr = item.company.addresses[0];
                s = addr.streetAddress;
                if (addr.streetAddress2) {
                    s += ", " + addr.streetAddress2;
                }
                s += ", " + addr.postalcode + ' ' + addr.city;
            }
            return s;
        }

        public getWwwSite(item: IFreeSearchResultItem): string {
            if (item.company.links) {
                for (var link of item.company.links) {
                    if (link.linktype == 'web') {
                        if (link.url.length > 4 && link.url.substr(0, 4) == 'http') {
                            return link.url;
                        } else {
                            return "http://" + link.url;
                        }
                    }
                }
            }
            return null;
        }

        public isFullCompanyDetailsVisible(item: IFreeSearchResultItem): boolean {
            var index = this.showMoreItems.indexOf(item);
            return index >= 0;
        }

        public setFullCompanyDetailsVisible(item: IFreeSearchResultItem) {
            this.showMoreItems.push(item);
        }
        

        /**
         * Gets a small image url for the specified company.
         *
         * If the small company image is not available, then the placeholder image
         * 'images/mun_palvelut_siivouspalvelu_placeholder-04.png' should be used!
         */
        public getSmallImageUrl(item: IFreeSearchResultItem): string {
            var self = this;

            var url = self.images[item.company.id];

            if (!url) {
                url = "images/mun_palvelut_siivouspalvelu_placeholder-04.png";
                self.images[item.company.id] = url;
                self.dataService.query<IKuva>('yritysKuvat/' + item.company.id).then(data => {
                    if (data && data.length > 0) {
                        let image = data[0];
                        var idx = image.url.lastIndexOf('/');
                        url = "/api/Image/" + image.url.substr(idx + 1);
                        self.images[item.company.id] = url;
                    } else {
                        url = "images/mun_palvelut_siivouspalvelu_placeholder-04.png";
                        self.images[item.company.id] = url;
                    }
                });                
            }

            return url;
        }

    }

    // Create components
    app.component("ptShowSearchResults", {
        templateUrl: () => getUrl('/Page/ShowSearchResults'),
        controller: ShowSearchResultsController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/searchresults', {
            template: '<pt-show-search-results><pt-show-search-results>'
        });
    });
}
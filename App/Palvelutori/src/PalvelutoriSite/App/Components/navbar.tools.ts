namespace Palvelutori {
    class NavbarToolsController {

        static $inject = ["$http", "$location", "bfErrorService", "ptSearchData"];

        constructor(
            private $http: ng.IHttpService,
            private $location: ng.ILocationService,
            private errorService: BusinessForms.BFErrorService,
            public searchData: SearchDataService) {
        }

        public search() {
            var self = this;

            if (!self.searchData.freeSearchKey || self.searchData.freeSearchKey === null || self.searchData.freeSearchKey.trim().length === 0) {
                self.$location.path('/show/searchresults');
                return;
            }

            self.$http.post<string>('/api/YritysSearch/searchFromCompanies', JSON.stringify(self.searchData.freeSearchKey))
                .then(data => {
                    self.searchData.notifyFreeSearchResultsChanged(self.transform(data.data));
                    self.$location.path('/show/searchresults');
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

        public setLanguage(language: string) {
            var self = this;

            var prevLanguage: string = Palvelutori.languagePrefix;

            Palvelutori.languagePrefix = language;

            var newUrl: string = '';

            var absUrl: string = self.$location.absUrl();

            if (absUrl.indexOf('#') > 0) {
                if (absUrl.indexOf(prevLanguage + '#') > 0) {
                    newUrl = absUrl.replace(prevLanguage + '#', language + '#');
                }
            } else {
                if (absUrl.lastIndexOf('/' + prevLanguage) === absUrl.length - ('/' + prevLanguage).length) {
                    newUrl = absUrl.replace('/' + prevLanguage, '/' + language);
                } else {
                    if (absUrl.lastIndexOf('/') === absUrl.length - 1) {
                        newUrl = absUrl + language + '#/';
                    } else {
                        newUrl = absUrl + '/' + language + '#/';
                    }
                }
            }

            window.location.href = newUrl;
        }

    }

    app.component("ptNavbarTools", {
        transclude: true,
        templateUrl: getUrl('/Components/NavBarTools'),
        controller: NavbarToolsController
    });
}
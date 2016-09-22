namespace Palvelutori {
    class ProcessProducerResultsController {
        public searchData: SearchDataService;
        public isLoading: boolean;
        public searchOk: boolean;
        public isSelectOpen: boolean = false;
     
        static $inject = ["$scope", "bfDataService", "$location", "ptLogin"];

        constructor(
            private _scope: ng.IScope,
            private _dataService: BusinessForms.BFDataService,
            private _location: ng.ILocationService,
            private _login: LoginService) {
            var self = this;
            self.searchOk = true;
            _scope.$watch(() => JSON.stringify(self.searchData.data), () => self.reload());
        }

        private reload() {
            var self = this;

            self.ensureSelectIsClosed();
            self.isLoading = true;

            var succeed: boolean = true;

            self._dataService.postQuery<IYritysSearch>('search', self.searchData.data, failure => {
                succeed = false;
                if (failure.status == 400) {
                    self.searchOk = !failure.data.Paiva;
                    return true;
                }
                return false;
            }).then(data => {
                if (succeed) {
                    data = self.searchData.doClientSideFiltering(data);
                    data = self.searchData.doClientSideSorting(data);

                    if (this.isChanged(data)) {
                        self.searchResults = data;
                    }

                    self.searchData.latestSearchResults = data;
                    self.isLoading = false;
                    self.searchOk = true;
                }
                return true;
            });
        }
   
        private isChanged(newData: IYritysSearch[]) {
            if (newData.length != this.searchResults.length) {
                return true;
            }
            for (var idx in newData) {
                if (this.searchResults[idx].company.id != newData[idx].company.id) {
                    return true;
                }
            }
            return false;
        }

        public calcPrice(item: IYritysSearch) {
            return this.searchData.calcPrice(item.company);
        }

        public ignore(ev: ng.IAngularEvent) {
            ev.stopPropagation();
            ev.preventDefault();
        }

        public confirm(item: IYritysSearch) {
            this.searchData.data.yritys = item.company;
            if (this._login.isLoggedIn) {
                this._location.path('/process/confirm');
            } else {
                this._login.pendingReturn = '/process/confirm';
                this._location.path('/show/login');
            }
        }

        public details(item: IYritysSearch) {
            this.searchData.data.yritys = item.company;
            this._location.path('/process/producerdetails');
        }

        /**
         * Search results.
         */
        public searchResults: IYritysSearch[] = [];

        /**
         * Gets a small image url for the specified company.
         *
         * If the small company image is not available, then the placeholder image
         * 'images/mun_palvelut_siivouspalvelu_placeholder-04.png' should be used!
         */
        public getSmallImageUrl(item: IYritysSearch): string {
            var self = this;
            if (!item.kuvat) {
                item.kuvat = [];
                self._dataService.query<IKuva>('yritysKuvat/' + item.company.id).then(data => {
                    item.kuvat = data;
                });
            }       
            if (item.kuvat && item.kuvat.length > 0) {
                var kuva = item.kuvat[0];
                var idx = kuva.url.lastIndexOf('/');
                return "/api/Image/" + kuva.url.substr(idx + 1);
            }

            return "images/mun_palvelut_siivouspalvelu_placeholder-04.png";
        }

        /**
         * Gets the rating value for the specified company. A value must be between 0-5.
         * 0 means that there are not valid ratings -> no stars will be shown!
         */
        public getRating(item: IYritysSearch): number {
            var rating: number = 0;

            var tmp: number = item.company.rating;

            if (item.company.rating) {
                if (tmp > 0 && tmp <= 1) {
                    rating = 1;
                }
                else if (tmp > 1 && tmp <= 2) {
                    rating = 2;
                }
                else if (tmp > 2 && tmp <= 3) {
                    rating = 3;
                }
                else if (tmp > 3 && tmp <= 4) {
                    rating = 4;
                }
                else if (tmp > 4) {
                    rating = 5;
                }
            }

            return rating;
        }

        /**
         * Gets a short description text for the specified company.
         */
        public getShortDescription(item: IYritysSearch): string {
            var description: string;

            description = item.company.shortdescription[Palvelutori.languagePrefix];
            if (description) {
                if (description.length > 96) {
                    description = description.substring(0, 95) + ' ...';
                }
            } else {
                description = item.company.description[Palvelutori.languagePrefix];
                if (description) {
                    if (description.length > 96) {
                        description = description.substring(0, 95) + ' ...';
                    }
                } else {
                    description = '';                    
                }
            }

            return description;
        }

        public toggleSelect() {
            var self = this;
            self.isSelectOpen = !self.isSelectOpen;
        }

        public ensureSelectIsClosed() {
            var self = this;
            if (self.isSelectOpen) {
                self.isSelectOpen = false;                            
            }
        }

        public switchSortingMethod(method: ISearchDataSortingMethod) {
            var self = this;
            self.searchData.sortingMethod = method;
            self.searchData.data.sortingMethodId = method.id;
            self.ensureSelectIsClosed();
        }
    }

    app.component("ptProcessProducerResults", {
        transclude: true,
        bindings: {
            searchData: '=',
            searchOk: '='
        },
        templateUrl: () => getUrl('/Components/ProcessProducerResults'),
        controller: ProcessProducerResultsController
    });
}
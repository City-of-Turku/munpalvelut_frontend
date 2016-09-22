
namespace Palvelutori {
    export interface ISearchData {
        kohde: IKohde;
        me: IKayttaja;
        paiva: string;
        aika: ITimeSlot;
        paketti: IPackage;
        yritys: IYritys;
        hinta: string;
        kesto: number,
        hinta2: number;
        lisatiedot?: string;
        psopFilter: boolean;
        sortingMethodId: string;
    }

    export interface IFreeSearchResultItem {
        company: IYritys;
    }

    export interface IYritysSearch {
        company: IYritys;
        suitability: number;
        kuvat: IKuva[];
    }

    export interface ITimeSlot {
        id: string;
        nameFi: string;
        nameSv: string;
        from: number;
        to: number;
    }

    export interface ISearchDataSortingMethod {
        id: string;
        nameFi: string;
        nameSv: string;
    }

    export class SearchDataService extends BusinessForms.BFPersistData<ISearchData> {
        static $inject = ["$rootScope"];

        private processStep: number = 0;
        private processSubStep: number = 0;

        public latestSearchResults: IYritysSearch[] = null;
        public sortingMethods: ISearchDataSortingMethod[] = [];
        public sortingMethod: ISearchDataSortingMethod = null;

        public freeSearchKey: string = '';
        public latestFreeSearchResults: IFreeSearchResultItem[] = [];

        constructor(root: ng.IRootScopeService) {
            super(root, "palvelutori.search", BusinessForms.PersistStorageTypes.SessionStorage);
            var self = this;
            self.initSortingMethods();
        }

        private initSortingMethods() {
            var self = this;
            self.sortingMethods = [];

            // all sorting methods
            self.sortingMethods.push({ id: 'PRICE', nameFi: 'Edullisin ensin', nameSv: 'Det förmånligaste först' });
            self.sortingMethods.push({ id: 'NAME', nameFi: 'Aakkosjärjestyksessä', nameSv: 'I alfabetisk ordning' });
            self.sortingMethods.push({ id: 'RATING', nameFi: 'Tähtiarviointijärjestyksessä', nameSv: 'I rangordning med stjärnor' });

            // the default sorting method
            self.sortingMethod = self.sortingMethods[0];
            self.data.sortingMethodId = self.sortingMethod.id;
        }

        public setCurrentProcessStep(step: number, subStep: number = 0) {
            var self = this;
            self.processStep = step;
            self.processSubStep = subStep;
        }

        public get currentProcessStep(): number {
            return this.processStep;
        }

        public get currentProcessSubStep(): number {
            return this.processSubStep;
        }

        public switchDataFromSessionStorageToLocalStorage() {
            var json = window.sessionStorage.getItem('palvelutori.search');
            if (json) {
                window.localStorage.setItem('palvelutori.search', json);
            }
        }

        public switchDataFromLocalStorageToSessionStorage() {
            var json = window.localStorage.getItem('palvelutori.search');
            if (json) {
                window.localStorage.removeItem('palvelutori.search');
                window.sessionStorage.setItem('palvelutori.search', json);
                this.data = JSON.parse(json);
            }
        }

        public calcPrice(forCompary: IYritys) {
            var self = this;
            var price: number = self.calcPriceImpl(forCompary);
            return price.toFixed(2).replace(".", ",");
        }

        private calcPriceImpl(forCompary: IYritys) : number {
            var duration = this.calcDuration(forCompary);
            if (!duration) {
                return null;
            }
            var pricePerHour: number = this.getPricePerHour(forCompary);
            var price: number = pricePerHour * duration;
            return price;
        }

        public calcDuration(forCompary: IYritys) {
            var item: IYritys = forCompary || this.data.yritys;
            var rooms = Number(this.data.kohde.room_count);
            var sanitaries = Number(this.data.kohde.sanitary_count);

            if (!rooms || !sanitaries || !item) {
                return null;
            }

            return (rooms + sanitaries / 2.0);
        }

        public getPricePerHourFormatted(forCompary: IYritys): string {
            var price: number = this.getPricePerHour(forCompary);
            return price.toFixed(2).replace(".", ",");
        }

        public getPricePerHour(forCompary: IYritys): number {
            var item: IYritys = forCompary || this.data.yritys;;
            switch (this.data.paketti.pricing_formula) {
                case 'S':
                    return item.price_per_hour;
                case 'C':
                    return item.price_per_hour_continuing;
                default:
                    return item.price_per_hour;
            }
        }

        /**
         * Proceeds the client-side filtering for search results.
         */
        public doClientSideFiltering(data: IYritysSearch[]): IYritysSearch[] {
            var self = this;

            var items: IYritysSearch[] = [];

            for (var i = 0; i < data.length; i++) {
                var item: IYritysSearch = data[i];
                var accept: boolean = true;

                // Filter by PSOP flag if required.
                if (self.data.psopFilter && item.company.psop === false) {
                    accept = false;
                }

                if (accept) {
                    items.push(item);
                }
            }

            return items;
        }

        /**
         * Proceeds the client-side sorting for search results.
         */
        public doClientSideSorting(data: IYritysSearch[]): IYritysSearch[] {
            var self = this;
            switch (self.sortingMethod.id) {
                case 'PRICE':
                    return self.doClientSideSortingByPrice(data);
                case 'NAME':
                    return self.doClientSideSortingByName(data);
                case 'RATING':
                    return self.doClientSideSortingByRating(data);
                default:
                    return data;
            }
        }

        private doClientSideSortingByPrice(data: IYritysSearch[]): IYritysSearch[] {
            var self = this;

            return data.sort((item1: IYritysSearch, item2: IYritysSearch) => {
                let price1 = self.calcPriceImpl(item1.company);
                let price2 = self.calcPriceImpl(item2.company);

                if (price1 > price2) {
                    return 1;
                }
                if (price1 < price2) {
                    return -1;
                }

                let name1 = item1.company.name;
                let name2 = item2.company.name;

                if (name1 > name2) {
                    return 1;
                }
                if (name1 < name2) {
                    return -1;
                }

                return 0;
            });
        }

        private doClientSideSortingByName(data: IYritysSearch[]): IYritysSearch[] {
            return data.sort((item1: IYritysSearch, item2: IYritysSearch) => {
                let name1 = item1.company.name;
                let name2 = item2.company.name;

                if (name1 > name2) {
                    return 1;
                }
                if (name1 < name2) {
                    return -1;
                }

                return 0;
            });
        }

        private doClientSideSortingByRating(data: IYritysSearch[]): IYritysSearch[] {
            var self = this;

            return data.sort((item1: IYritysSearch, item2: IYritysSearch) => {
                let rating1 = item1.company.rating;
                let rating2 = item2.company.rating;

                if (rating1 > rating2) {
                    return -1;
                }
                if (rating1 < rating2) {
                    return 1;
                }

                let price1 = self.calcPriceImpl(item1.company);
                let price2 = self.calcPriceImpl(item2.company);

                if (price1 > price2) {
                    return 1;
                }
                if (price1 < price2) {
                    return -1;
                }

                let name1 = item1.company.name;
                let name2 = item2.company.name;

                if (name1 > name2) {
                    return 1;
                }
                if (name1 < name2) {
                    return -1;
                }

                return 0;
            });
        }

        public notifyFreeSearchResultsChanged(results: IFreeSearchResultItem[]) {
            var self = this;
            self.latestFreeSearchResults.splice(0, self.latestFreeSearchResults.length);
            for (let i = 0; i < results.length; i++) {
                self.latestFreeSearchResults.push(results[i]);
            }
        }

        public initNew() {
            var self = this;

            self.processStep = 0;
            self.processSubStep = 0;

            if (self.latestSearchResults != null && self.latestSearchResults.length > 0) {
                self.latestSearchResults.splice(0, self.latestSearchResults.length);                
            }

            self.data = {
                paiva: null,
                kohde: null,
                paketti: null,
                aika: null,
                yritys: null,
                hinta: '',
                me: null,
                kesto: null,
                hinta2: null,
                psopFilter: false,
                sortingMethodId: self.sortingMethod.id
            }
        }
    }

    export var timeSlots: ITimeSlot[];

    function createTimeSlot(id: string, from: number, to: number, nameFi: string, nameSv: string): ITimeSlot {
        return { id: id, nameFi: nameFi, nameSv: nameSv, from: from, to: to };
    }

    /**
     * Initializes timeslots.
     */
    function initTimeSlots() {
        Palvelutori.timeSlots = [];
        Palvelutori.timeSlots.push(createTimeSlot("2", 7 * 60, 12 * 60, "aamupäivä 7-12", "förmiddag 7-12"));
        Palvelutori.timeSlots.push(createTimeSlot("3", 12 * 60, 16 * 60, "iltapäivä 12-16", "eftermiddag 12-16"));
        Palvelutori.timeSlots.push(createTimeSlot("4", 16 * 60, 19 * 60, "alkuilta 16-19", "tidig afton 16-19"));
        Palvelutori.timeSlots.push(createTimeSlot("5", 19 * 60, 21 * 60, "myöhäisilta 19-21", "sen afton 19-21"));
    }

    app.service('ptSearchData', SearchDataService);
    initTimeSlots();
}
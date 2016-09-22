
namespace Palvelutori {
    export interface IYritys {
        id: string;
        addresses: any[];
        description: {
            [idx: string]: string;
        };
        shortdescription: {
            [idx: string]: string;
        }
        links2: {
            [idx: string]: ILink;
        };
        service_areas: string[];
        links: ILink[];
        offered_services: number[];
        price_per_hour_continuing: number;
        price_per_hour: number;
        businessid: string;
        name: string;
        psop: boolean;
        rating: number;
        email: string;
    }

    export interface ILink {
        linktype: string;
        url: string;
        description: string;
    }

    class YritystiedotEditController {
        yritys: {
            values: IYritys;
        }

        $onInit() {
            if (!this.yritys.values.addresses) {
                this.yritys.values.addresses = [];
            }
            if (this.yritys.values.addresses.length === 0) {
                this.yritys.values.addresses.push({ addressType: 'snailmail', city: ' ', country: 'FI', name: '???', postalcode: ' ', streetAddress: ' ', streetAddress2: ' ', subregion: ' '});
            }
            if (!this.yritys.values.description || !this.yritys.values.description["fi"]) {
                this.yritys.values.description = { fi: ' ', sv: ' ' };
            }
            if (!this.yritys.values.shortdescription || !this.yritys.values.shortdescription["fi"]) {
                this.yritys.values.shortdescription = { fi: ' ', sv: ' ' };
            }
            if (!this.yritys.values.links) {
                this.yritys.values.links = [];
            }
            if (!this.yritys.values.offered_services) {
                this.yritys.values.offered_services = [];
            }
            this.yritys.values.links2 = {};
            this.yritys.values.links.forEach(l => this.yritys.values.links2[l.linktype] = l);
            if (!this.yritys.values.links2["web"]) {
                var lnk = {
                    linktype: 'web', url: ' ', description: 'none'
                };
                this.yritys.values.links.push(lnk);
                this.yritys.values.links2["web"] = lnk;
            }
            var self = this;
            Object.defineProperty(this.yritys.values, 'calc_service_areas', {
                enumerable: true,
                get: function () {
                    if (self.yritys.values.service_areas) {
                        return self.yritys.values.service_areas.join(',');
                    }
                    return "";
                },
                set: function (value: string) {
                    var tmpAreas = value.split(',');
                    self.yritys.values.service_areas = [];
                    for (var area of tmpAreas) {
                        if (area && area.trim().length > 4) {
                            self.yritys.values.service_areas.push(area.trim());
                        }
                    }
                }
            });
        }

        addYoutube() {
            var lnk = {
                linktype: 'youtube', url: ' ', description: 'none'
            };
            this.yritys.values.links.push(lnk);
            this.yritys.values.links2["youtube"] = lnk;
        }

        offeredPaketti(pakettiId: number) {
            var hasPaketti = false;
            this.yritys.values.offered_services.forEach(value => hasPaketti = hasPaketti || value === pakettiId);
            return hasPaketti;
        }

        togglePaketti(pakettiId: number) {
            var matchIdx = -1;
            this.yritys.values.offered_services.forEach((value, idx) => {
                if (value == pakettiId) {
                    matchIdx = idx;
                }
            });
            if (matchIdx < 0) {
                this.yritys.values.offered_services.push(pakettiId);
            } else {
                this.yritys.values.offered_services.splice(matchIdx, 1);
            }
        }
    }


    app.component("ptYritystiedotEdit", {
        bindings: {
            yritys: '<',
            paketit: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Admin/YritystiedotEdit'),
        controller: YritystiedotEditController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/admin/yritystiedot/edit', {
            template: '<pt-yritystiedot-edit yritys="$resolve.yritys" paketit="$resolve.paketit"></pt-yritystiedot-edit>',
            resolve: {
                yritys: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService,
                    ptLogin: LoginService, ptInfoService: InfoService) {
                    return bfDataService.get('yritys', 'me', item => {
                        $location.path('/admin/home');
                        ptInfoService.addPendingNote(() => "Yritystiedot tallennettu!");
                    });
                },
                paketit: function (bfDataService: BusinessForms.BFDataService) {
                    return bfDataService.query('palvelupaketit/all');
                }
            }
        });
    });
}
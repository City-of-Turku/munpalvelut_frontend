namespace Palvelutori {
    interface ITilausInfo {
        tilaus: ITilaus;
        yritys: IYritys;
        paketti: IPackage;
    }

    interface ITilaus {
        company: string;
        service_package: string;
    }

    class ShowOrderController {
        tilausInfo: ITilausInfo;
        tilaus: any;

        price: string = null;

        static $inject = ["$window"];

        constructor(private $window: ng.IWindowService) {
            var self = this;

            self.tilaus = self.tilausInfo.tilaus;
            self.price = self.tilaus.price.toFixed(2).replace(".", ",");
        }

        public printPage() {
            this.$window.print();
        }
    }

    // Create components
    app.component("ptShowOrder", {
        bindings: {
            tilausInfo: '<'
        },
        templateUrl: () => getUrl('/Page/ShowOrder'),
        controller: ShowOrderController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/order/show/:id', {
            template: '<pt-show-order tilaus-info="$resolve.tilausInfo"></pt-show-order>',
            resolve: {
                tilausInfo: function (bfDataService: BusinessForms.BFDataService, ptLogin: LoginService, $route: angular.route.IRouteService) {

                    var base = bfDataService.fetch <ITilaus>('kayttajaTilaus/fetch/' + $route.current.params.id, { userId: ptLogin.userId });
                    var base2 = base.then(tilaus => {
                        var info: ITilausInfo = {
                            tilaus: tilaus, yritys: null, paketti: null
                        }
                        return bfDataService.fetch<IYritys>('search/company/' + tilaus.company).then(data => {
                            info.yritys = data;
                            return info;
                        }).then(tmpInfo => {
                            return bfDataService.fetch<IPackage>('palveluPaketit/' + tilaus.service_package).then(pp => {
                                info.paketti = pp;
                                return info;
                            });
                        });
                    });
                    return base2.then(final => {
                        return final;
                    });
                }
            }
        });
    });
}
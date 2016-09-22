/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    
    class CreateKohdeController {
        item: BusinessForms.BFDataItem;
        static $inject = ["ptLogin"];

        constructor(private _loginService: LoginService) {
        }
        $onInit() {        
            this.item.setV('user', this._loginService.userId);
        }
    }

    // Create components
    app.component("ptCreateKohde", {
        bindings: {
            item: '<'
        },
        templateUrl: () => getUrl('/Page/CreateKohde'),
        controller: CreateKohdeController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/create/kohde', {
            template: '<pt-create-kohde item="$resolve.kohde"><pt-create-kohde>',
            resolve: {
                kohde: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService) {
                    return bfDataService.create('kohde',
                        item => $location.url('/show/perustiedot')
                    );
                }
            }
        });
    });
}
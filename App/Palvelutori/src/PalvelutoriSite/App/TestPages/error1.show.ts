
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class CreateKohdeController {
        $onInit() {
        }
    }

    // Create components
    app.component("ptTestShowError1", {
        bindings: {
            item: '<'
        },
        template: '<h2>You should not see this</h2>',
        controller: CreateKohdeController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/test/show/error1', {
            template: '<pt-test-show-error1 item="$resolve.error1"><pt-test-show-error>',
            resolve: {
                error1: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService) {
                    return bfDataService.create('error1',
                        item => $location.url('')
                    );
                }
            }
        });
    });
}
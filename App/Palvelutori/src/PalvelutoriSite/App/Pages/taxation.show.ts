namespace Palvelutori {
    class ShowTaxationController {
        static $inject = ["ptScrolling"];

        constructor(
            private scrolling: ScrollingService) {
        }
    }

    // Create components
    app.component("ptShowTaxation", {
        templateUrl: () => getUrl('/Page/ShowTaxation'),
        controller: ShowTaxationController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/taxation', {
            template: '<pt-show-taxation><pt-show-taxation>'
        });
    });
}
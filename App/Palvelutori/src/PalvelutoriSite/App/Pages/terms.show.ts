namespace Palvelutori {
    class ShowTermsController {
        static $inject = ["ptScrolling"];

        constructor(
            private scrolling: ScrollingService) {
        }
    }

    // Create components
    app.component("ptShowTerms", {
        templateUrl: () => getUrl('/Page/ShowTerms'),
        controller: ShowTermsController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/terms', {
            template: '<pt-show-terms><pt-show-terms>'
        });
    });
}
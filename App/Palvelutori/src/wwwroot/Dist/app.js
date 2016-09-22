/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />
var SP;
(function (SP) {
    SP.app = angular.module('palvelutori', ['ngRoute', 'businessForms']);
    var MainCtrl = (function () {
        function MainCtrl() {
            this.hello = 'Hello 123';
        }
        return MainCtrl;
    })();
    SP.MainCtrl = MainCtrl;
    SP.app.controller('mainCtrl', MainCtrl);
    SP.app.config(function ($routeProvider) {
        $routeProvider.otherwise({
            template: '<sp-home></sp-home>'
        });
    });
    SP.app.run(function ($q) {
        BusinessForms.registerGet('test', function (id) { return $q(function (res, rej) {
            res({ id: id, name: 'Name ' + id });
        }); });
    });
})(SP || (SP = {}));
var SP;
(function (SP) {
    var NavbarController = (function () {
        function NavbarController() {
            this.project_name = "Test";
        }
        return NavbarController;
    })();
    SP.app.component("spNavbar", {
        transclude: true,
        templateUrl: '/App/Components/navbar.html',
        controller: NavbarController
    });
})(SP || (SP = {}));
var SP;
(function (SP) {
    var FooterController = (function () {
        function FooterController() {
            this.project_name = "Test";
        }
        return FooterController;
    })();
    SP.app.component("spFooter", {
        template: '<hr><div>Footer here {{ $ctrl.project_name }}</div>',
        controller: FooterController
    });
})(SP || (SP = {}));
var SP;
(function (SP) {
    var HomeController = (function () {
        function HomeController() {
        }
        return HomeController;
    })();
    SP.app.component("spHome", {
        transclude: true,
        templateUrl: '/App/Components/home.html',
        controller: HomeController
    });
})(SP || (SP = {}));
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
var SP;
(function (SP) {
    var Test1ShowController = (function () {
        function Test1ShowController() {
            var i = 1;
        }
        return Test1ShowController;
    })();
    // Create components
    SP.app.component("spTest1Show", {
        bindings: {
            items: '<'
        },
        template: '<h2>Test page 1</h2><div ng-repeat="item in $ctrl.items"> {{ item.value }}</div>',
        controller: Test1ShowController
    });
    // Configure route
    SP.app.config(function ($routeProvider) {
        $routeProvider.when('/test1/show', {
            template: '<sp-test1-show items="$resolve.items.data"></sp-test1-show>',
            resolve: {
                items: function ($http) {
                    return $http.get('/AppData/testlist.json');
                }
            }
        });
    });
})(SP || (SP = {}));
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />
var SP;
(function (SP) {
    var Test2ShowController = (function () {
        function Test2ShowController() {
            var i = 1;
        }
        return Test2ShowController;
    })();
    // Create components
    SP.app.component("spTest2Show", {
        bindings: {
            item: '<'
        },
        template: "<h2>Test page 2</h2>\n<bf-form item=\"$ctrl.item\"><bf-span path=\"name\"></bf-span> </bf-form>",
        controller: Test2ShowController
    });
    // Configure route
    SP.app.config(function ($routeProvider) {
        $routeProvider.when('/test2/show', {
            template: '<sp-test2-show item="$resolve.item"></sp-test2-show>',
            resolve: {
                item: function (bfDataService) {
                    return bfDataService.get('test', '1');
                }
            }
        });
    });
})(SP || (SP = {}));
//# sourceMappingURL=app.js.map
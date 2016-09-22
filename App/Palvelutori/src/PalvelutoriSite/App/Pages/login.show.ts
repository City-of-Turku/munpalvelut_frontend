
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/businessforms/businessforms.d.ts" />

namespace Palvelutori {
    class ShowLoginController {
        static $inject = ["ptSearchData", "ptLoginData", "ptLogin"];

        public useFixedBackButton: boolean = false;
        public fixedBackButtonUrl: string=null;


        constructor(
            private searchData: SearchDataService,
            private loginData: LoginDataService,
            private login: LoginService) {

            var self = this;

            if (searchData.currentProcessStep === 2) {
                self.useFixedBackButton = true;
                self.fixedBackButtonUrl = "#/process/producer";
            }
        }
       
        $onInit() {
        }
    }

    export interface ILoginCompleted {
        token: string;
        userName: string;
    }

    // Create components
    app.component("ptShowLogin", {
        bindings: {
            item: '<'
        },
        templateUrl: () => getUrl('/Page/ShowLogin'),
        controller: ShowLoginController
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/login', {
            template: '<pt-show-login item="$resolve.login"><pt-show-login>',
            resolve: {
                checkHttps: function ($location: ng.ILocationService) {
                    if ($location.protocol() === "http") {
                        window.location.href = "https:" + $location.absUrl().substr(5);
                    }
                },
                login: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService) {
                    return bfDataService.command <ILoginCompleted>('login', 
                        reply => {
                            ptLogin.login(reply.token, reply.userName, null, null);
                            bfDataService.get('kayttaja', 'me').then(reply2 => {
                                var userId = reply2.values["id"];
                                var companyId = reply2.values["company"];
                                ptLogin.login(reply.token, reply.userName, userId, companyId);
                                $location.url(ptLogin.pendingReturn);
                            });
                        }
                    );
                }
            }
        });
    });
}
namespace Palvelutori {
    class ShowRegister2Controller {
        static $inject = ["ptScrolling"];

        constructor(private scrolling: ScrollingService) {
        }

        $onInit() {
            var self = this;
            setTimeout(() => {
                self.scrolling.scrollTo('registerStepForBasicData');
            }, 500);
        }
    }

    // Create components
    app.component("ptShowRegister2", {
        bindings: {
            newKayttaja: '<'
        },
        templateUrl: () => getUrl('/Page/ShowRegister2'),
        controller: ShowRegister2Controller
    });

    // Configure route
    app.config(function ($routeProvider: angular.route.IRouteProvider) {
        $routeProvider.when('/show/register2', {
            template: '<pt-show-register2 new-kayttaja="$resolve.kayttaja"><pt-show-register2>',
            resolve: {
                kayttaja: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService, ptRegistration: RegistrationService) {
                    return bfDataService.create('NewKayttaja',
                        reply => {
                            return bfDataService.command<ILoginCompleted>('login', tokenItem => {
                                ptRegistration.clearStoredVetumaAuthenticationId();
                                ptLogin.login(tokenItem.token, '', null, null);
                                $location.path('/show/welcome');
                            }).then(bf => {
                                bf.setV('email', reply.values.email);
                                bf.setV('password', reply.values.salasana1);
                                bf.save();
                            });
                        }
                    );
                }
            }
        });
    });

}
namespace Palvelutori {
    export interface IKuva {
        url: string;
        id: string;
    }

    class AdminHomeController {
        static $inject = ["bfDataService", "ptLogin"]
        constructor(private _dataService: BusinessForms.BFDataService, private _loginService: LoginService) {
        }

        yritys: {
            values: IYritys;
        }
        yritysKuvat: any[];
        addMode: number;

        $onInit() {
            this.addMode = 0;
        }

        setAddMode(mode: number) {
            this.addMode = mode;
        }

        uploadFile(content: string) {
            // alert('Length ' + content.length);
            var self = this;
            self.addMode = 2;
            self._dataService.create('yritysKuva?companyId=' + this._loginService.companyId, completed => {
                self.addMode = 0;
                self.reloadKuvat();
            }).then(dataItem => {
                var idx = content.indexOf('base64,');
                if (idx > 0) {
                    content = content.substr(idx + 7);
                }
                dataItem.setV('image', content);
                dataItem.save();
            });
        }

        getImage(kuva: IKuva) {
            var idx = kuva.url.lastIndexOf('/');
            return "/api/Image/" + kuva.url.substr(idx + 1);
        }

        removeImage(kuva: IKuva) {
            if (!confirm('Haluatko varmasti poistaa tämän kuvan?')) {
                return;
            }
            var self = this;
            self._dataService.delete('yritysKuva', kuva.id, { companyId: + this._loginService.companyId }).then(data => {
                self.reloadKuvat();
            });
        }

        private reloadKuvat() {
            var self = this;
            self._dataService.query('yritysKuvat/' + self._loginService.companyId).then(data => {
                self.yritysKuvat = data;
            });
        }

        get eiPaketteja() {
            return !this.yritys.values.offered_services || this.yritys.values.offered_services.length == 0;
        }
    }

    interface ILoginCompleted {
        token: string;
        userName: string;
    }

    app.component("ptAdminHome", {
        bindings: {
            yritys: '<',
            yritysKuvat: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Admin/AdminHome'),
        controller: AdminHomeController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        if (!Palvelutori.isAdminHome)
            return;
        $routeProvider.otherwise( {
            template: '<pt-admin-home yritys="$resolve.yritys" yritys-kuvat="$resolve.yritysKuvat"></pt-admin-home>',
            resolve: {
                yritys: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService) {
                    return bfDataService.get('yritys', 'me');
                },
                yritysKuvat: function (bfDataService: BusinessForms.BFDataService, $location: ng.ILocationService, ptLogin: LoginService) {
                    return bfDataService.query('yritysKuvat/' + ptLogin.companyId);
                }
            }
        });
    });
}
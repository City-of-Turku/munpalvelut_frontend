namespace Palvelutori {
    export class RegistrationService {
        static $inject = ["$http", "$location", "bfErrorService", "ptLogin"];

        constructor(
            private $http: ng.IHttpService,
            private $location: ng.ILocationService,
            private errorService: BusinessForms.BFErrorService,
            private loginService: LoginService) {
        }

        public isRegistrationStarted: boolean = false;

        public isRegistrationStep1Completed: boolean = false;

        public isRegistrationStep2Completed: boolean = false;

        public redirectoToVetumaRoutePage(vetumaId: string) {
            var url: string = getUrl(`/Vetuma/Authenticate?id=${vetumaId}`);
            window.location.href = url;
        }

        public getVetumaAuthenticationIdForNewUser(onId: (vetumaId: string) => void) {
            var self = this;
            this.$http.post<string>('/api/NewKayttaja/beginVetumaForRegistration', {
                headers: { "Authorization": "token " + this.loginService.token }
            }).then(function (data) {
                onId(data.data);
            }).catch(error => self.errorService.showError('begin Vetuma', error));
        }

        public getVetumaAuthenticationIdForPasswordRecovery(onId: (vetumaId: string) => void) {
            var self = this;
            this.$http.post<string>('/api/ResetPassword/beginVetumaForPasswordRecovery', {
                headers: { "Authorization": "token " + this.loginService.token }
            }).then(function (data) {
                onId(data.data);
            }).catch(error => self.errorService.showError('begin Vetuma', error));
        }

        public storeVetumaAuthenticationId(vetumaId: string) {
            window.localStorage.setItem('vetuma.auth.id', vetumaId);
        }

        public getStoredVetumaAuthenticationId(): string {
            var vetumaId: string = window.localStorage.getItem('vetuma.auth.id');
            return vetumaId;
        }

        public clearStoredVetumaAuthenticationId() {
            window.localStorage.removeItem('vetuma.auth.id');
        }

    }

    app.service('ptRegistration', RegistrationService);

}
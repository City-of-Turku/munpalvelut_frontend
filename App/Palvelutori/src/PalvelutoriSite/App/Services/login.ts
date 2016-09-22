
namespace Palvelutori {
    export class LoginService {
        static $inject = ["ptLoginData", "$location", "ptSearchData"];

        constructor(private _loginData: LoginDataService, private _location: ng.ILocationService, private _searchData: SearchDataService) {
        }

        pendingReturn: string = '';

        /**
         * Test is user is logged in.
         * 
         */
        // TODO: How to handle login expiration
        get isLoggedIn() {
            return this._loginData.data.token ? true : false;
        }

        get userId() {
            if (this.isLoggedIn) {
                return this._loginData.data.userId;
            }
            return null;
        }
        get userName() {
            return this._loginData.data.userName;
        }

        get token() {
            return this._loginData.data.token;
        }

        get companyId() {
            return this._loginData.data.companyId;
        }
        
        redirectToLogin() {
            if (this._location.url() == "/show/login")
                return true;
            this.pendingReturn = this._location.url();
            // LK: Reverted change due to browser incompabilities.
            // window.location.replace(window.location.pathname + "#/show/login");
            this._location.url("/show/login");
            return true;
        }

        login(token: string, userName: string, userId: string, companyId: string) {
            this._loginData.data.token = token;
            this._loginData.data.userName = userName;
            this._loginData.data.userId = userId;
            this._loginData.data.companyId = companyId;
        }

        logout() {
            this._loginData.data.token = null;
            this._loginData.data.userId = null;
            this._loginData.data.userName = "";
            this._loginData.data.companyId = null;
            this._searchData.initNew();
            this._location.url('');
        }
    }

    app.service('ptLogin', LoginService);
    app.run(function (ptLogin: LoginService) {
        BusinessForms.BFDataService.customRequestOptions.push(function (config) {
            if (ptLogin.isLoggedIn) {
                config.headers = { "Authorization": "token " + ptLogin.token };
            }
        });
    });

    app.run(function (bfErrorService: BusinessForms.BFErrorService, ptLogin: LoginService) {
        bfErrorService.needAuthorize = () => ptLogin.redirectToLogin();
    });

}
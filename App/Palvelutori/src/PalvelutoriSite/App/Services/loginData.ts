
namespace Palvelutori {
    export interface ILoginData {
        /**
         * User access token
         */
        token: string;

        /**
         * User visible name
         */
        userName: string;

        /**
         * User identity
         */
        userId: string;

        /**
         * Accept cookies
         */
        cookies: boolean;

        /**
         * Company ID If company member
         */
        companyId: string;
        vetumaReturn: string;
    }

    export class LoginDataService extends BusinessForms.BFPersistData<ILoginData> {
        static $inject = ["$rootScope"]
        constructor(root: ng.IRootScopeService) {
            super(root, "palvelutori.login", BusinessForms.PersistStorageTypes.LocalStorage);
        }
    }

    app.service('ptLoginData', LoginDataService);
}
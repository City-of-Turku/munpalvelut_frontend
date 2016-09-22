/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />


module BusinessForms {
    export interface IErrorInfo {
        errorSource: string;
        error: any;
        errorInfo: any;
    }

    export class BFErrorService {
        static $inject = ["$log", "$rootScope", "$location"];
        lastError: IErrorInfo;
        errors: IErrorInfo[];
        needAuthorize: () => boolean;
        constructor(private _log: ng.ILogService,
            private _rootScope: ng.IRootScopeService, private _location: ng.ILocationService) {
            var self = this;
            self.errors = [];
            self.lastError = null;
            _rootScope.$on("$routeChangeError", ev => self.routeError(ev));
        }

        showError(errorSource: string, error: any) {
            this.lastError = {
                errorSource: errorSource,
                error: error,
                errorInfo: this.parseErrorInfo(error)
            };
            if (error.status && error.status == 401) {
                if (this.needAuthorize && this.needAuthorize()) {
                    return;
                }
            }
            if (error.status && error.status == 403) {
                this._location.url('/show/forbidden');
                return;
            }
            this.errors.push(this.lastError);
            this._location.url('/show/error');            
        }

        private parseErrorInfo(error: any):any  {
            if (error.status) { // Http error
                return { status: error.status, statusText: error.statusText };
            }
            return {
                asString: error.toString()
            }
        }

        private routeError(ev: ng.IAngularEvent) {
            this.showError("Routing error", ev);
        }
    }
    app.service("bfErrorService", BFErrorService);
}

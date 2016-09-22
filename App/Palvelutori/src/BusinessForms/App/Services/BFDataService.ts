/// <reference path="../../typings/angularjs/angular.d.ts" />


module BusinessForms {

    export var app = angular.module('businessForms', [ 'ngRoute']);

    export interface IHttpResponce {
        status: Number;
        data: any;
    }

  
    export class BFDataService {
        static $inject = ["$http", "$q", "appUrl", "bfErrorService"];

        static customRequestOptions: ((config: ng.IRequestShortcutConfig) => void)[];

        /**
         * Called when validation failed
         */
        static onValidationFailed: ((item: BFDataItem) => void)[];

        constructor(private _http: ng.IHttpService, private _q: ng.IQService, private _appUrl, private _errorService: BFErrorService) {

        }

        /**
         * Perform query
         * @param itemQuery Query name
         * @param args Query arguments
         */
        query<T>(itemQuery: string, args?: any):ng.IPromise<T[]> {
            var self = this;
            var config = this.getRequestConfig(args);

            var data = self._http.get<T[]>(self._appUrl + itemQuery, config);
            
            var reply = new this._q<T[]>((resolve, reject) => {
                data.then(
                    ok => {
                        if (angular.isArray(ok.data)) {
                            resolve(ok.data);
                        }
                        var ok2 = (ok.data as any).results;
                        resolve(ok2);
                    }                                ,
                    error => reject(error));
            });
            reply.catch(error => self.processError("Query",  error));
            return reply;
        }

        /**
         * Perform post que
         * @param itemQuery Query name
         * @param args Query arguments
         */
        postQuery<T>(itemQuery: string, args: any, handleError?: (error: any) => boolean): ng.IPromise<T[]> {
            var self = this;
            var config = this.getRequestConfig();

            var data = self._http.post<T[]>(self._appUrl + itemQuery, args, config).then(                
                ok => {
                    if (angular.isArray(ok.data)) {
                        return ok.data;
                    }
                    var ok2 = (ok.data as any).results;
                    return ok2;
                }, error => (handleError ? handleError(error) : false) || self.processError("Post query", error));
            return data;
        }

        /**
         * Perform post for item
         * @param itemPath Item path
         * @param args Arguments
         */
        postItem(itemPath: string, args: any): ng.IPromise<any> {
            var self = this;
            var config = this.getRequestConfig();

            var data = self._http.post<any>(self._appUrl + itemPath, args, config).
                then(ok => { return ok.data }).
                catch(error => self.processError("Post query", error));
            return data;
        }

        /**
        * Perform single item query
        * @param itemQuery Query name
        * @param args Query arguments
        */
        fetch<T>(itemQuery: string, args?: any): ng.IPromise<T> {
            var self = this;
            var config = this.getRequestConfig(args);

            var data = self._http.get<T>(self._appUrl + itemQuery, config);
            data.catch(error => self.processError("Fetch", error));
            return data.then(ok => ok.data);
        }

        /**
         * Retrieve existing item
         * @param itemType
         * @param id
         */
        get(itemType: string, id: string, onCompleted?: (item: BFDataItem) => void): ng.IPromise<BFDataItem>{
            var self = this;
            var data: ng.IPromise<any> = null;
            var config = this.getRequestConfig();
            data = self._http.get(self._appUrl + itemType + "/" + id, config);
            return data.then(
                reply => self.createDataItem(itemType, reply, onCompleted),
                error => self.processError("Get", error));
        }

        /**
         * Create
         * @param itemType Item CRUD controller
         * @param parentId Parent ID for item
         */
        create(itemType: string, onCompleted: (item: BFDataItem) => void, parentId?: string): ng.IPromise<BFDataItem> {
            var data: ng.IPromise<any> = null;
            var self = this;
            var config = this.getRequestConfig(parentId ? { parentId: parentId } : null); 
            data = self._http.get(self._appUrl + itemType, config);
            var promise = data.then(
                values => self.createDataItem(itemType, values, onCompleted));
            promise.catch(error => self.processError("Create", error));
            return promise;
        }

        /**
         * Run command
         * @param itemType Item CRUD controller
         * @param opComplete Action to complete login
         */
        command<T>(itemType: string, onCompleted: (item: T) => void): ng.IPromise<BFDataItem> {
            var data: ng.IPromise<any> = null;
            var self = this;
            var config = this.getRequestConfig();
            data = self._http.get(self._appUrl + itemType, config);
            var promise = data.then(
                values => self.createCommandItem(itemType, values, onCompleted));
            promise.catch(error => self.processError("Create", error));
            return promise;
        }

        /**
         * Called from data item to update content to server. No not call directly
         * Called must handle request rejections!
         * @param itemType
         * @param item
         */
        update(itemType: string, values: any): ng.IPromise<ng.IHttpPromiseCallbackArg<any>> {
            var id = values.id;
            var self = this;
            var config = this.getRequestConfig(); 
            if (id) {
                var data = self._http.put(self._appUrl + itemType + "/" + id, values, config);
            } else {
                data = self._http.post(self._appUrl + itemType, values, config);
            }           
            return data;
        }

        /**
         * Delete item
         * @param itemType Item type
         * @param id Item id
         */
        delete(itemType: string, id: string, args?: any) {
            var config = this.getRequestConfig(args);
            return this._http.delete(this._appUrl + itemType + "/" + id, config);
        }

        getRequestConfig(params?: any): ng.IRequestShortcutConfig {
            var config: ng.IRequestShortcutConfig = {};
            config.params = {
                _t: Date.now()
            }
            if (params) {
                angular.merge(config.params, params);
            }
            for (var row of BFDataService.customRequestOptions) {
                row(config);
            }
            return config;
        }

        /**
         * Internal helper to create reject response
         * @param error
         */
        reject(error: any): ng.IPromise<any> {
            return this._q.reject(error);
        }

        createDataItem(itemType: string, reply: { data: any }, onCompleted: (item: BFDataItem) => void) {
            var item = new BFDataItem(this, itemType, reply.data, onCompleted);
            return item;
        }

        createCommandItem<T>(itemType: string, reply: { data: any }, onCompleted: (item: T) => void) {
            var item = new BFCommandItem<T>(this, itemType, reply.data, onCompleted);
            return item;
        }

        processError(requestType: string, error: any) {
            if (error.$handled)
                return;
            this._errorService.showError("HTTP Request: " + requestType, error);
        }
    }

    app.service('bfDataService', BFDataService);
    app.value('appUrl', "/api/");
    BFDataService.customRequestOptions = [];
    BFDataService.onValidationFailed = [];
}


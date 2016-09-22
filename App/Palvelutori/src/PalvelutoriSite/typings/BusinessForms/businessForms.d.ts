/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
declare module BusinessForms {
    var app: ng.IModule;
    interface IHttpResponce {
        status: Number;
        data: any;
    }
    class BFDataService {
        private _http;
        private _q;
        private _appUrl;
        private _errorService;
        static $inject: string[];
        static customRequestOptions: ((config: ng.IRequestShortcutConfig) => void)[];
        /**
         * Called when validation failed
         */
        static onValidationFailed: ((item: BFDataItem) => void)[];
        constructor(_http: ng.IHttpService, _q: ng.IQService, _appUrl: any, _errorService: BFErrorService);
        /**
         * Perform query
         * @param itemQuery Query name
         * @param args Query arguments
         */
        query<T>(itemQuery: string, args?: any): ng.IPromise<T[]>;
        /**
         * Perform post que
         * @param itemQuery Query name
         * @param args Query arguments
         */
        postQuery<T>(itemQuery: string, args: any, handleError?: (error: any) => boolean): ng.IPromise<T[]>;
        /**
         * Perform post for item
         * @param itemPath Item path
         * @param args Arguments
         */
        postItem(itemPath: string, args: any): ng.IPromise<any>;
        /**
        * Perform single item query
        * @param itemQuery Query name
        * @param args Query arguments
        */
        fetch<T>(itemQuery: string, args?: any): ng.IPromise<T>;
        /**
         * Retrieve existing item
         * @param itemType
         * @param id
         */
        get(itemType: string, id: string, onCompleted?: (item: BFDataItem) => void): ng.IPromise<BFDataItem>;
        /**
         * Create
         * @param itemType Item CRUD controller
         * @param parentId Parent ID for item
         */
        create(itemType: string, onCompleted: (item: BFDataItem, data: any) => void, parentId?: string): ng.IPromise<BFDataItem>;
        /**
         * Run command
         * @param itemType Item CRUD controller
         * @param opComplete Action to complete login
         */
        command<T>(itemType: string, onCompleted: (item: T) => void): ng.IPromise<BFDataItem>;
        /**
         * Called from data item to update content to server. No not call directly
         * Called must handle request rejections!
         * @param itemType
         * @param item
         */
        update(itemType: string, values: any): ng.IPromise<ng.IHttpPromiseCallbackArg<any>>;
        /**
         * Delete item
         * @param itemType Item type
         * @param id Item id
         */
        delete(itemType: string, id: string, args?: any): ng.IHttpPromise<{}>;
        getRequestConfig(params?: any): ng.IRequestShortcutConfig;
        /**
         * Internal helper to create reject response
         * @param error
         */
        reject(error: any): ng.IPromise<any>;
        createDataItem(itemType: string, reply: {
            data: any;
        }, onCompleted: (item: BFDataItem) => void): BFDataItem;
        createCommandItem<T>(itemType: string, reply: {
            data: any;
        }, onCompleted: (item: T) => void): BFCommandItem<T>;
        processError(requestType: string, error: any): void;
    }
}
declare module BusinessForms {
    enum DataItemStates {
        Unsaved = 0,
        Invalid = 1,
        Completed = 2,
    }
    class BFDataItem {
        private _dataService;
        private _itemType;
        private _values;
        private _onCompleted;
        private _validationErrors;
        private _serverErrors;
        private _state;
        constructor(_dataService: BFDataService, _itemType: string, _values: any, _onCompleted: (item: BFDataItem, data: any) => void);
        /**
         * Save chanhes
         */
        save(): void;
        private saveFailed(error);
        private saved(rep);
        /**
         * Override to handle completed event
         */
        onCompleted(data: any): void;
        /**
         * Data item state
         */
        state: DataItemStates;
        /**
         * Test if property is readonly
         */
        readonly: boolean;
        /**
         * Get actual values. For debugging etc. Not not modify values directly!
         */
        values: any;
        /**
         * Retrieve value from item. Call with throw exception if value is not available
         * @param path Path for value
         */
        getV(path: string): any;
        /**
         * Set value for for path
         * @param path Path for value
         * @param value Value to set
         */
        setV(path: string, value: any): void;
        /**
         * Retrieve error message(s) related to given path
         * @param path
         */
        getError(path: string): any;
        /**
         * Set validation error for path
         * @param path Property path
         * @param error Error to set or null to reset
         */
        setValidationError(path: string, error: string): void;
        /**
         * List of all errors
         */
        errors(): string[];
        private parseServerErrors(errors, errorList, prefix);
    }
}
declare module BusinessForms {
    class BFCommandItem<T> extends BFDataItem {
        private _onCommandCompleted;
        constructor(_dataService: BFDataService, _itemType: string, _values: any, _onCommandCompleted: (item: T) => void);
        onCompleted(data: T): void;
    }
}
declare module BusinessForms {
    interface IErrorInfo {
        errorSource: string;
        error: any;
        errorInfo: any;
    }
    class BFErrorService {
        private _log;
        private _rootScope;
        private _location;
        static $inject: string[];
        lastError: IErrorInfo;
        errors: IErrorInfo[];
        needAuthorize: () => boolean;
        constructor(_log: ng.ILogService, _rootScope: ng.IRootScopeService, _location: ng.ILocationService);
        showError(errorSource: string, error: any): void;
        private parseErrorInfo(error);
        private routeError(ev);
    }
}
declare module BusinessForms {
    interface IBFBindToScope extends ng.IScope {
        format?: string;
        bfBindTo: BFDataItem;
        path: string;
    }
    class BindToController {
        private _scope;
        static $inject: string[];
        private _element;
        hasValue: boolean;
        isPending: boolean;
        onFormat: (val: any) => string;
        onParse: (val: string) => any;
        constructor(_scope: IBFBindToScope);
        setElement(element: ng.IAugmentedJQuery): void;
        onInput(ev: JQueryInputEventObject): void;
        getValue(): any;
        updateValue(): void;
        formatValue(val: any): any;
        parseValue(val: string): any;
    }
}
declare module BusinessForms {
}
declare module BusinessForms {
    interface IBValidationFeedbackScope extends ng.IScope {
        bfValidationFeedback: BFDataItem;
        path: string;
    }
}
declare module BusinessForms {
}
declare module BusinessForms {
    enum PersistStorageTypes {
        /**
         * You must override getJsonData and setJsonData
         */
        Custom = 0,
        /**
         * Local storage
         */
        LocalStorage = 1,
        /**
         * Session storage
         */
        SessionStorage = 2,
    }
    class BFPersistData<T> {
        key: string;
        private _storageType;
        private _jsonData;
        /**
         * Settable data
         */
        data: T;
        constructor($root: ng.IRootScopeService, key: string, _storageType: PersistStorageTypes);
        private checkChanged();
        onInit(): void;
        /**
         * Return current serialized data from
         */
        getJsonData(): string;
        setJsonData(newData: string): void;
    }
}
declare module BusinessForms {
    var Strings: {
        "numformat": string;
    };
}

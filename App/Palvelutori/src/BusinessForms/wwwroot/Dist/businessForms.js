var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    BusinessForms.app = angular.module('businessForms', ['ngRoute']);
    var BFDataService = (function () {
        function BFDataService(_http, _q, _appUrl, _errorService) {
            this._http = _http;
            this._q = _q;
            this._appUrl = _appUrl;
            this._errorService = _errorService;
        }
        /**
         * Perform query
         * @param itemQuery Query name
         * @param args Query arguments
         */
        BFDataService.prototype.query = function (itemQuery, args) {
            var self = this;
            var config = this.getRequestConfig(args);
            var data = self._http.get(self._appUrl + itemQuery, config);
            var reply = new this._q(function (resolve, reject) {
                data.then(function (ok) {
                    if (angular.isArray(ok.data)) {
                        resolve(ok.data);
                    }
                    var ok2 = ok.data.results;
                    resolve(ok2);
                }, function (error) { return reject(error); });
            });
            reply.catch(function (error) { return self.processError("Query", error); });
            return reply;
        };
        /**
         * Perform post que
         * @param itemQuery Query name
         * @param args Query arguments
         */
        BFDataService.prototype.postQuery = function (itemQuery, args, handleError) {
            var self = this;
            var config = this.getRequestConfig();
            var data = self._http.post(self._appUrl + itemQuery, args, config).then(function (ok) {
                if (angular.isArray(ok.data)) {
                    return ok.data;
                }
                var ok2 = ok.data.results;
                return ok2;
            }, function (error) { return (handleError ? handleError(error) : false) || self.processError("Post query", error); });
            return data;
        };
        /**
         * Perform post for item
         * @param itemPath Item path
         * @param args Arguments
         */
        BFDataService.prototype.postItem = function (itemPath, args) {
            var self = this;
            var config = this.getRequestConfig();
            var data = self._http.post(self._appUrl + itemPath, args, config).
                then(function (ok) { return ok.data; }).
                catch(function (error) { return self.processError("Post query", error); });
            return data;
        };
        /**
        * Perform single item query
        * @param itemQuery Query name
        * @param args Query arguments
        */
        BFDataService.prototype.fetch = function (itemQuery, args) {
            var self = this;
            var config = this.getRequestConfig(args);
            var data = self._http.get(self._appUrl + itemQuery, config);
            data.catch(function (error) { return self.processError("Fetch", error); });
            return data.then(function (ok) { return ok.data; });
        };
        /**
         * Retrieve existing item
         * @param itemType
         * @param id
         */
        BFDataService.prototype.get = function (itemType, id, onCompleted) {
            var self = this;
            var data = null;
            var config = this.getRequestConfig();
            data = self._http.get(self._appUrl + itemType + "/" + id, config);
            return data.then(function (reply) { return self.createDataItem(itemType, reply, onCompleted); }, function (error) { return self.processError("Get", error); });
        };
        /**
         * Create
         * @param itemType Item CRUD controller
         * @param parentId Parent ID for item
         */
        BFDataService.prototype.create = function (itemType, onCompleted, parentId) {
            var data = null;
            var self = this;
            var config = this.getRequestConfig(parentId ? { parentId: parentId } : null);
            data = self._http.get(self._appUrl + itemType, config);
            var promise = data.then(function (values) { return self.createDataItem(itemType, values, onCompleted); });
            promise.catch(function (error) { return self.processError("Create", error); });
            return promise;
        };
        /**
         * Run command
         * @param itemType Item CRUD controller
         * @param opComplete Action to complete login
         */
        BFDataService.prototype.command = function (itemType, onCompleted) {
            var data = null;
            var self = this;
            var config = this.getRequestConfig();
            data = self._http.get(self._appUrl + itemType, config);
            var promise = data.then(function (values) { return self.createCommandItem(itemType, values, onCompleted); });
            promise.catch(function (error) { return self.processError("Create", error); });
            return promise;
        };
        /**
         * Called from data item to update content to server. No not call directly
         * Called must handle request rejections!
         * @param itemType
         * @param item
         */
        BFDataService.prototype.update = function (itemType, values) {
            var id = values.id;
            var self = this;
            var config = this.getRequestConfig();
            if (id) {
                var data = self._http.put(self._appUrl + itemType + "/" + id, values, config);
            }
            else {
                data = self._http.post(self._appUrl + itemType, values, config);
            }
            return data;
        };
        /**
         * Delete item
         * @param itemType Item type
         * @param id Item id
         */
        BFDataService.prototype.delete = function (itemType, id, args) {
            var config = this.getRequestConfig(args);
            return this._http.delete(this._appUrl + itemType + "/" + id, config);
        };
        BFDataService.prototype.getRequestConfig = function (params) {
            var config = {};
            config.params = {
                _t: Date.now()
            };
            if (params) {
                angular.merge(config.params, params);
            }
            for (var _i = 0, _a = BFDataService.customRequestOptions; _i < _a.length; _i++) {
                var row = _a[_i];
                row(config);
            }
            return config;
        };
        /**
         * Internal helper to create reject response
         * @param error
         */
        BFDataService.prototype.reject = function (error) {
            return this._q.reject(error);
        };
        BFDataService.prototype.createDataItem = function (itemType, reply, onCompleted) {
            var item = new BusinessForms.BFDataItem(this, itemType, reply.data, onCompleted);
            return item;
        };
        BFDataService.prototype.createCommandItem = function (itemType, reply, onCompleted) {
            var item = new BusinessForms.BFCommandItem(this, itemType, reply.data, onCompleted);
            return item;
        };
        BFDataService.prototype.processError = function (requestType, error) {
            if (error.$handled)
                return;
            this._errorService.showError("HTTP Request: " + requestType, error);
        };
        BFDataService.$inject = ["$http", "$q", "appUrl", "bfErrorService"];
        return BFDataService;
    }());
    BusinessForms.BFDataService = BFDataService;
    BusinessForms.app.service('bfDataService', BFDataService);
    BusinessForms.app.value('appUrl', "/api/");
    BFDataService.customRequestOptions = [];
    BFDataService.onValidationFailed = [];
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    (function (DataItemStates) {
        DataItemStates[DataItemStates["Unsaved"] = 0] = "Unsaved";
        DataItemStates[DataItemStates["Invalid"] = 1] = "Invalid";
        DataItemStates[DataItemStates["Completed"] = 2] = "Completed";
    })(BusinessForms.DataItemStates || (BusinessForms.DataItemStates = {}));
    var DataItemStates = BusinessForms.DataItemStates;
    var BFDataItem = (function () {
        function BFDataItem(_dataService, _itemType, _values, _onCompleted) {
            this._dataService = _dataService;
            this._itemType = _itemType;
            this._values = _values;
            this._onCompleted = _onCompleted;
            this._validationErrors = {};
            this._serverErrors = {};
            this._state = DataItemStates.Unsaved;
        }
        /**
         * Save chanhes
         */
        BFDataItem.prototype.save = function () {
            if (this.readonly) {
                throw "Attempt to call save on readonly item!";
            }
            var self = this;
            this._dataService.update(self._itemType, self._values).
                then(function (rep) { return self.saved(rep); }, function (error) { return self.saveFailed(error); });
        };
        BFDataItem.prototype.saveFailed = function (error) {
            if (error.status == 422 || error.status == 400) {
                this._state = DataItemStates.Invalid;
                this._serverErrors = error.data;
                for (var _i = 0, _a = BusinessForms.BFDataService.onValidationFailed; _i < _a.length; _i++) {
                    var validationErrorHandler = _a[_i];
                    validationErrorHandler(this);
                }
                return null;
            }
            return this._dataService.processError("Update", error);
        };
        BFDataItem.prototype.saved = function (rep) {
            this._state = DataItemStates.Completed;
            this.onCompleted(rep.data);
        };
        /**
         * Override to handle completed event
         */
        BFDataItem.prototype.onCompleted = function (data) {
            this._onCompleted(this, data);
        };
        Object.defineProperty(BFDataItem.prototype, "state", {
            /**
             * Data item state
             */
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BFDataItem.prototype, "readonly", {
            /**
             * Test if property is readonly
             */
            get: function () {
                return !this._onCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BFDataItem.prototype, "values", {
            /**
             * Get actual values. For debugging etc. Not not modify values directly!
             */
            get: function () {
                return this._values;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Retrieve value from item. Call with throw exception if value is not available
         * @param path Path for value
         */
        BFDataItem.prototype.getV = function (path) {
            var val = this._values;
            for (var _i = 0, _a = path.split('.'); _i < _a.length; _i++) {
                var seg = _a[_i];
                val = val[seg];
                if (angular.isUndefined(val))
                    throw "Undefined path " + path;
            }
            return val;
        };
        /**
         * Set value for for path
         * @param path Path for value
         * @param value Value to set
         */
        BFDataItem.prototype.setV = function (path, value) {
            var val = this._values;
            var segs = path.split('.');
            while (segs.length > 1) {
                val = val[segs.shift()];
                if (angular.isUndefined(val))
                    throw "Undefined path " + path;
            }
            val[segs[0]] = value;
        };
        /**
         * Retrieve error message(s) related to given path
         * @param path
         */
        BFDataItem.prototype.getError = function (path) {
            var err = this._validationErrors[path];
            if (err) {
                return err;
            }
            var val = this._serverErrors;
            if (!val)
                return;
            var segs = path.split('.');
            while (segs.length > 0) {
                if (val == null) {
                    return null;
                }
                val = val[segs.shift()];
            }
            if (angular.isArray(val)) {
                return val.join(', ');
            }
            return val;
        };
        /**
         * Set validation error for path
         * @param path Property path
         * @param error Error to set or null to reset
         */
        BFDataItem.prototype.setValidationError = function (path, error) {
            if (error) {
                this._validationErrors[path] = error;
            }
            else {
                delete this._validationErrors[path];
            }
        };
        /**
         * List of all errors
         */
        BFDataItem.prototype.errors = function () {
            var errorList = [];
            for (var idx in this._validationErrors) {
                errorList.push(this._validationErrors[idx] + " (" + idx + ")");
            }
            if (this._serverErrors) {
                this.parseServerErrors(this._serverErrors, errorList, "");
            }
            return errorList;
        };
        BFDataItem.prototype.parseServerErrors = function (errors, errorList, prefix) {
            for (var idx in errors) {
                if (angular.isObject(errors[idx])) {
                    this.parseServerErrors(errors[idx], errorList, prefix + (prefix ? "." : "") + idx);
                }
                else {
                    errorList.push(errors[idx] + " (" + prefix + ")");
                }
            }
        };
        return BFDataItem;
    }());
    BusinessForms.BFDataItem = BFDataItem;
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    var BFCommandItem = (function (_super) {
        __extends(BFCommandItem, _super);
        function BFCommandItem(_dataService, _itemType, _values, _onCommandCompleted) {
            _super.call(this, _dataService, _itemType, _values, function (item) {
                throw "Should never happed";
            });
            this._onCommandCompleted = _onCommandCompleted;
        }
        BFCommandItem.prototype.onCompleted = function (data) {
            this._onCommandCompleted(data);
        };
        return BFCommandItem;
    }(BusinessForms.BFDataItem));
    BusinessForms.BFCommandItem = BFCommandItem;
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    var BFErrorService = (function () {
        function BFErrorService(_log, _rootScope, _location) {
            this._log = _log;
            this._rootScope = _rootScope;
            this._location = _location;
            var self = this;
            self.errors = [];
            self.lastError = null;
            _rootScope.$on("$routeChangeError", function (ev) { return self.routeError(ev); });
        }
        BFErrorService.prototype.showError = function (errorSource, error) {
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
        };
        BFErrorService.prototype.parseErrorInfo = function (error) {
            if (error.status) {
                return { status: error.status, statusText: error.statusText };
            }
            return {
                asString: error.toString()
            };
        };
        BFErrorService.prototype.routeError = function (ev) {
            this.showError("Routing error", ev);
        };
        BFErrorService.$inject = ["$log", "$rootScope", "$location"];
        return BFErrorService;
    }());
    BusinessForms.BFErrorService = BFErrorService;
    BusinessForms.app.service("bfErrorService", BFErrorService);
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    var BindToController = (function () {
        function BindToController(_scope) {
            this._scope = _scope;
            var self = this;
            self.hasValue = false;
            self.isPending = false;
            _scope.$watch(function () { return self.getValue(); }, function () { return self.updateValue(); });
        }
        BindToController.prototype.setElement = function (element) {
            this._element = element;
            var el = element[0];
            var self = this;
            function processInput(ev) {
                self.onInput(ev);
                self._scope.$apply();
            }
            function loseFocus(ev) {
                self.hasValue = false;
                self.updateValue();
            }
            // el.addEventListener("input", processInput);
            // el.addEventListener("change", processInput);
            element.on('input', processInput);
            element.on('blur', loseFocus);
            self._scope.$on('$destroy', function () { return element.off('input', processInput); });
            self._scope.$on('$destroy', function () { return element.off('blur', loseFocus); });
        };
        BindToController.prototype.onInput = function (ev) {
            try {
                var val = this.parseValue(this._element.val());
            }
            catch (error) {
                this._scope.bfBindTo.setValidationError(this._scope.path, error.toString());
                return;
            }
            this._scope.bfBindTo.setValidationError(this._scope.path, null);
            this._scope.bfBindTo.setV(this._scope.path, val);
        };
        BindToController.prototype.getValue = function () {
            var scope = this._scope;
            if (scope.bfBindTo) {
                return scope.bfBindTo.getV(scope.path);
            }
        };
        BindToController.prototype.updateValue = function () {
            if (this._element[0] === document.activeElement && this.hasValue) {
                return;
            }
            this.hasValue = true;
            this._element.val(this.formatValue(this.getValue()));
        };
        BindToController.prototype.formatValue = function (val) {
            if (this.onFormat) {
                return this.onFormat(val);
            }
            if (val) {
                return val.toString();
            }
            return "";
        };
        BindToController.prototype.parseValue = function (val) {
            if (this.onParse) {
                return this.onParse(val);
            }
            return val;
        };
        BindToController.$inject = ["$scope"];
        return BindToController;
    }());
    BusinessForms.BindToController = BindToController;
    function BFBindToDirective() {
        return {
            scope: {
                bfBindTo: '<',
                format: '@',
                path: '@name'
            },
            controller: BindToController,
            link: function (scope, element, attrs, ctrl) {
                ctrl.setElement(element);
            }
        };
    }
    BusinessForms.app.directive('bfBindTo', BFBindToDirective);
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    function BFFormatNumberDirective() {
        return {
            require: 'bfBindTo',
            link: function (scope, element, attrs, ctrl) {
                var scale = Number(attrs.bfFormatNumber);
                ctrl.onParse = function (val) {
                    if (!val)
                        return null;
                    var tmp = val.replace(',', '.');
                    if ((tmp - 0) == tmp) {
                        return (tmp - 0);
                    }
                    throw val + " " + BusinessForms.Strings["numformat"];
                };
                ctrl.onFormat = function (val) {
                    if (angular.isNumber(val)) {
                        return val.toFixed(scale).replace('.', ',');
                    }
                    var tmp = val;
                    if (angular.isString(val)) {
                        return tmp.replace('.', ',');
                    }
                    return tmp;
                };
            }
        };
    }
    BusinessForms.app.directive('bfFormatNumber', BFFormatNumberDirective);
})(BusinessForms || (BusinessForms = {}));
var BusinessForms;
(function (BusinessForms) {
    var ValidationFeedbackController = (function () {
        function ValidationFeedbackController($scope) {
            this._scope = $scope;
        }
        ValidationFeedbackController.prototype.setElement = function (element) {
            if (!this._scope.bfValidationFeedback) {
                return;
            }
            var self = this;
            self._scope.$watch(function () { return self._scope.bfValidationFeedback.getError(self._scope.path); }, function (newValue) {
                if (newValue) {
                    element.addClass("has-feedback has-warning");
                }
                else {
                    element.removeClass("has-feedback has-warning");
                }
            });
        };
        return ValidationFeedbackController;
    }());
    function BFValidationFeedbackDirective() {
        return {
            scope: {
                bfValidationFeedback: '<',
                path: '@name'
            },
            controller: ValidationFeedbackController,
            link: function (scope, element, attrs, ctrl) {
                ctrl.setElement(element);
            }
        };
    }
    BusinessForms.app.directive('bfValidationFeedback', BFValidationFeedbackDirective);
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    var ShowErrorController = (function () {
        function ShowErrorController(errorService) {
            this.errorService = errorService;
            this.errors = errorService.errors;
        }
        ShowErrorController.prototype.$onInit = function () {
        };
        ShowErrorController.$inject = ["bfErrorService"];
        return ShowErrorController;
    }());
    // Create components
    BusinessForms.app.component("bfShowError", {
        bindings: {
            item: '<'
        },
        templateUrl: '/Home/ShowError',
        controller: ShowErrorController
    });
    BusinessForms.app.config(function ($routeProvider) {
        $routeProvider.when('/show/error', {
            template: '<bf-show-error></bf-show-error>'
        });
    });
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    (function (PersistStorageTypes) {
        /**
         * You must override getJsonData and setJsonData
         */
        PersistStorageTypes[PersistStorageTypes["Custom"] = 0] = "Custom";
        /**
         * Local storage
         */
        PersistStorageTypes[PersistStorageTypes["LocalStorage"] = 1] = "LocalStorage";
        /**
         * Session storage
         */
        PersistStorageTypes[PersistStorageTypes["SessionStorage"] = 2] = "SessionStorage";
    })(BusinessForms.PersistStorageTypes || (BusinessForms.PersistStorageTypes = {}));
    var PersistStorageTypes = BusinessForms.PersistStorageTypes;
    var BFPersistData = (function () {
        function BFPersistData($root, key, _storageType) {
            this.key = key;
            this._storageType = _storageType;
            var self = this;
            self.onInit();
            $root.$watch(function () { return self.checkChanged(); });
        }
        BFPersistData.prototype.checkChanged = function () {
            var jdata = JSON.stringify(this.data);
            if (jdata !== this._jsonData) {
                this._jsonData = jdata;
                this.setJsonData(this._jsonData);
            }
        };
        BFPersistData.prototype.onInit = function () {
            this._jsonData = this.getJsonData();
            if (!this._jsonData) {
                this.data = {};
            }
            else {
                this.data = JSON.parse(this._jsonData);
            }
        };
        /**
         * Return current serialized data from
         */
        BFPersistData.prototype.getJsonData = function () {
            switch (this._storageType) {
                case PersistStorageTypes.LocalStorage:
                    if (window.localStorage) {
                        return window.localStorage.getItem(this.key);
                    }
                    return null;
                case PersistStorageTypes.SessionStorage:
                    if (window.sessionStorage) {
                        return window.sessionStorage.getItem(this.key);
                    }
                    return null;
                default:
                    throw new Error("You must supply own getJsonData implementation");
            }
        };
        BFPersistData.prototype.setJsonData = function (newData) {
            switch (this._storageType) {
                case PersistStorageTypes.LocalStorage:
                    if (window.localStorage) {
                        return window.localStorage.setItem(this.key, newData);
                    }
                    return null;
                case PersistStorageTypes.SessionStorage:
                    if (window.sessionStorage) {
                        return window.sessionStorage.setItem(this.key, newData);
                    }
                    return null;
                default:
                    throw new Error("You must supply own setJsonData implementation");
            }
        };
        return BFPersistData;
    }());
    BusinessForms.BFPersistData = BFPersistData;
})(BusinessForms || (BusinessForms = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
var BusinessForms;
(function (BusinessForms) {
    BusinessForms.Strings = {
        "numformat": "is not a valid number"
    };
})(BusinessForms || (BusinessForms = {}));
//# sourceMappingURL=businessForms.js.map
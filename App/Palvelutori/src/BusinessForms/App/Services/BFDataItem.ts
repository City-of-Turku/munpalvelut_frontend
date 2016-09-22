/// <reference path="../../typings/angularjs/angular.d.ts" />

module BusinessForms {
    export enum DataItemStates {
        Unsaved = 0,

        Invalid = 1,

        Completed = 2
    }

    
    export class BFDataItem {
        private _validationErrors: { [index: string]: string };
        private _serverErrors: { [index: string]: string };
        private _state: DataItemStates;
        constructor(private _dataService: BFDataService, private _itemType:string, private _values: any, private _onCompleted: (item: BFDataItem, data: any) => void) {
            this._validationErrors = {};
            this._serverErrors = {};
            this._state = DataItemStates.Unsaved;
        }

        /**
         * Save chanhes
         */
        save() {
            if (this.readonly) {
                throw "Attempt to call save on readonly item!";
            }
            var self = this;
            this._dataService.update(self._itemType, self._values).
                then(rep => self.saved(rep), error => self.saveFailed(error));
            
        }

        private saveFailed(error: IHttpResponce) {
            if (error.status == 422 || error.status == 400) {
                this._state = DataItemStates.Invalid;
                this._serverErrors = error.data;
                for (var validationErrorHandler of BFDataService.onValidationFailed) {
                    validationErrorHandler(this);
                }
                return null;
            }
            return this._dataService.processError("Update", error);
        }

        private saved(rep: ng.IHttpPromiseCallbackArg<any>) {
            this._state = DataItemStates.Completed;
            this.onCompleted(rep.data);
            
        }

        /**
         * Override to handle completed event
         */
        onCompleted(data: any) {
            this._onCompleted(this, data);
        }

        /**
         * Data item state
         */
        get state() {
            return this._state;
        }
        /**
         * Test if property is readonly
         */
        get readonly() {
            return !this._onCompleted;
        }

        /**
         * Get actual values. For debugging etc. Not not modify values directly!
         */
        get values() {
            return this._values;
        }

        /**
         * Retrieve value from item. Call with throw exception if value is not available
         * @param path Path for value
         */
        getV(path: string) {
            var val = this._values;
            for (var seg of path.split('.')) {
                val = val[seg];
                if (angular.isUndefined(val))
                    throw `Undefined path ${path}`;
            }

            return val;
        }

        /**
         * Set value for for path
         * @param path Path for value
         * @param value Value to set
         */
        setV(path: string, value: any) {
            var val = this._values;
            var segs = path.split('.');
            while (segs.length > 1) {
                val = val[segs.shift()];
                if (angular.isUndefined(val))
                    throw `Undefined path ${path}`;
            }
            val[segs[0]] = value;
        }

        /**
         * Retrieve error message(s) related to given path
         * @param path
         */
        getError(path: string) {

            var err = this._validationErrors[path];
            if (err) {
                return err;
            }
            var val: any = this._serverErrors;
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
        }
        
        /**
         * Set validation error for path
         * @param path Property path
         * @param error Error to set or null to reset
         */
        setValidationError(path: string, error: string) {
            if (error) {
                this._validationErrors[path] = error;
            } else {
                delete this._validationErrors[path];
            }
        }

        /**
         * List of all errors
         */
        errors() {
            var errorList: string[] = [];
            for (var idx in this._validationErrors) {
                errorList.push(this._validationErrors[idx] + " (" + idx + ")");
            }
            if (this._serverErrors) {
                this.parseServerErrors(this._serverErrors, errorList, "");
            }
           
            return errorList;
        }

        private parseServerErrors(errors: any, errorList: string[], prefix: string) {
            for (var idx in errors) {
                if (angular.isObject(errors[idx])) {
                    this.parseServerErrors(errors[idx], errorList, prefix + (prefix ? "." : "") + idx);
                } else {
                    errorList.push(errors[idx] + " (" + prefix + ")");
                }
            }
        }
    }
}
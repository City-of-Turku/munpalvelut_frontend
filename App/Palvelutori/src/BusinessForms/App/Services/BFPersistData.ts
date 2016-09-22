/// <reference path="../../typings/angularjs/angular.d.ts" />

module BusinessForms {
    export enum PersistStorageTypes {
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
        SessionStorage = 2
    }

    export class BFPersistData<T> {
        private _jsonData: string;
        /**
         * Settable data
         */
        data: T;
        constructor($root: ng.IRootScopeService, public key: string, private _storageType: PersistStorageTypes ) {
            var self = this;
            self.onInit();
            $root.$watch(() => self.checkChanged());
        }

        private checkChanged() {
            var jdata = JSON.stringify(this.data);
            if (jdata !== this._jsonData) {
                this._jsonData = jdata;
                this.setJsonData(this._jsonData);
            }
        }

        onInit() {
            this._jsonData = this.getJsonData();
            if (!this._jsonData) {
                this.data = {} as T;
            } else {
                this.data = JSON.parse(this._jsonData) as T;
            }
        }

        /**
         * Return current serialized data from 
         */
        getJsonData(): string {
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
        }

        setJsonData(newData: string) {
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
        }
    }
}

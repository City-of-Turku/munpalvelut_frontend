
/// <reference path="../../typings/angularjs/angular.d.ts" />

module BusinessForms {
    export class BFCommandItem<T> extends BFDataItem {
        constructor(_dataService: BFDataService, _itemType: string, _values: any, private _onCommandCompleted: (item: T) => void) {
            super(_dataService, _itemType, _values, item => {
                throw "Should never happed";
            });

        }

        onCompleted(data: T) {
            this._onCommandCompleted(data);
        }
    }
}
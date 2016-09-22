/// <reference path="../../typings/angularjs/angular.d.ts" />

module BusinessForms {
    export interface IBFBindToScope extends ng.IScope {
        format?: string;
        bfBindTo: BFDataItem;
        path: string;
    }
    export class BindToController {
        static $inject = ["$scope"];
        private _element: ng.IAugmentedJQuery;

        hasValue: boolean;
        isPending: boolean;
        onFormat: (val: any) => string;
        onParse: (val: string) => any;

        constructor(private _scope: IBFBindToScope) {
            var self = this;
            self.hasValue = false;
            self.isPending = false;
            _scope.$watch(() => self.getValue(), () => self.updateValue()); 
        }

        setElement(element: ng.IAugmentedJQuery) {
            this._element = element;
            var el = element[0];
            var self = this;
            function processInput(ev: JQueryInputEventObject) {
                self.onInput(ev);
                self._scope.$apply();
            }
            function loseFocus(ev: JQueryInputEventObject) {
                self.hasValue = false;
                self.updateValue();
            }
            // el.addEventListener("input", processInput);
            // el.addEventListener("change", processInput);
            element.on('input', processInput);
            element.on('blur', loseFocus);
            self._scope.$on('$destroy', () => element.off('input', processInput));
            self._scope.$on('$destroy', () => element.off('blur', loseFocus));
        }

        onInput(ev: JQueryInputEventObject) {
            try {
                var val = this.parseValue(this._element.val());
            } catch (error) {
                this._scope.bfBindTo.setValidationError(this._scope.path, error.toString());
                return;
            }
            this._scope.bfBindTo.setValidationError(this._scope.path, null);
            this._scope.bfBindTo.setV(this._scope.path, val);
        }

        getValue() {
            var scope = this._scope;
            if (scope.bfBindTo) {
                return scope.bfBindTo.getV(scope.path);
            }
        }

        updateValue() {
            if (this._element[0] === document.activeElement && this.hasValue) {
                return;
            }
            this.hasValue = true;
            this._element.val(this.formatValue(this.getValue()));
        }

        formatValue(val) {
            if (this.onFormat) {
                return this.onFormat(val);
            }
            if (val) {
                return val.toString();
            }
            return "";
        }

        parseValue(val: string) {
            if (this.onParse) {
                return this.onParse(val);
            }
            return val;
        }
    }

    function BFBindToDirective(): ng.IDirective {
        return {
            scope: {
                bfBindTo: '<',
                format: '@',
                path: '@name'
            },
            controller: BindToController,
            link: function (scope: IBFBindToScope, element: ng.IAugmentedJQuery, attrs, ctrl: BindToController) {
                ctrl.setElement(element);
            }
        };
    }
    app.directive('bfBindTo', BFBindToDirective);
}
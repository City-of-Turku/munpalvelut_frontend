/// <reference path="../../typings/angularjs/angular.d.ts" />

module BusinessForms {
    interface INumberFormatAttrs extends ng.IAttributes {
        bfFormatNumber: string;
    }
    function BFFormatNumberDirective(): ng.IDirective {
        return {
            require: 'bfBindTo',
            link: function (scope: IBFBindToScope, element: ng.IAugmentedJQuery, attrs: INumberFormatAttrs, ctrl: BindToController) {
                var scale = Number(attrs.bfFormatNumber);
                ctrl.onParse = function (val: string) {
                    if (!val)
                        return null;
                    var tmp: any = val.replace(',', '.');
                    if ((tmp - 0) == tmp) {
                        return (tmp - 0);
                    }
                    throw val + " " + BusinessForms.Strings["numformat"];
                };
                ctrl.onFormat = function (val: number): string {
                    if (angular.isNumber(val)) {
                        return val.toFixed(scale).replace('.', ',');
                    }
                    var tmp: any = val;
                    if (angular.isString(val)) {
                        return tmp.replace('.', ',');
                    }
                    return tmp;
                }
            }
        };
    }
    app.directive('bfFormatNumber', BFFormatNumberDirective);
}
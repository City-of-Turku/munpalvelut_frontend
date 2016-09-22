
module BusinessForms {
    export interface IBValidationFeedbackScope extends ng.IScope {
        bfValidationFeedback: BFDataItem;
        path: string;
    }
    class ValidationFeedbackController {
       
        private _scope: IBValidationFeedbackScope;
        constructor($scope: IBValidationFeedbackScope) {
            this._scope = $scope;
        }
        setElement(element: ng.IAugmentedJQuery) {
            if (!this._scope.bfValidationFeedback) {
                return;
            }
            var self = this;
            self._scope.$watch(() => self._scope.bfValidationFeedback.getError(self._scope.path), function (newValue) {
                if (newValue) {
                    element.addClass("has-feedback has-warning");
                } else {
                    element.removeClass("has-feedback has-warning");
                }
            });
        }
    }

    function BFValidationFeedbackDirective(): ng.IDirective {
        return {
            scope: {
                bfValidationFeedback: '<',
                path: '@name'
            },
            controller: ValidationFeedbackController,
            link: function (scope: IBValidationFeedbackScope, element: ng.IAugmentedJQuery, attrs, ctrl: ValidationFeedbackController) {
                ctrl.setElement(element);
            }
        };
    }
    app.directive('bfValidationFeedback', BFValidationFeedbackDirective);
}
namespace Palvelutori {
    export function EnterPressDirective(): ng.IDirective {
        return {
            restrict: "A",
            link: (scope, element, attrs) => {
                element.bind("keydown keypress", event => {
                    if (!event.shiftKey && event.which === 13) {
                        scope.$apply(() => {
                            scope.$eval(attrs["ptEnterPress"], { 'event': event });
                        });
                        event.preventDefault();
                    }
                });
            }
        }
    };

    app.directive('ptEnterPress', EnterPressDirective);

}
namespace Palvelutori {
    interface IUploadScope extends ng.IScope {
        ptUpload: (arg: { content: string }) => void;
    }

    function UploadDirective(): ng.IDirective {
        return {
            scope: {
                'ptUpload': '&'
            },
            link: function (scope: IUploadScope, element: ng.IAugmentedJQuery, attrs) {
                var htmlElement = element[0] as HTMLInputElement;
                htmlElement.onchange = function () {
                    if (htmlElement.files.length > 0) {
                        var f = htmlElement.files[0];
                        var reader = new FileReader();
                        reader.onload = function () {
                            scope.ptUpload({
                                content: reader.result
                            });
                        }
                        reader.readAsDataURL(f);
                    }
                }
            }
        }
    }

    app.directive('ptUpload', UploadDirective);
}
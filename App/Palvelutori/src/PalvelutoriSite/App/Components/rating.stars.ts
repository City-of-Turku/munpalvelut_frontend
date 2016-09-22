namespace Palvelutori {
    class RatingStarsController {
        /**
         * Current rating. A value range is null, 0, 1, 2, 3, 4 or 5.
         */
        public rating: number;
        public editable: boolean;
        public orderId: string;

        static $inject = ["bfDataService", "ptLogin"];

        constructor(
            private _dataService: BusinessForms.BFDataService,
            private _loginService: LoginService) {
        }

        public getCssClassForStar(star: number) {
            var self = this;
            var s: string = '';

            if (self.rating) {
                if (self.rating >= star) {
                    s = 'fa fa-star pt-star';
                } else {
                    s = 'fa fa-star-o pt-star';
                }
            } else {
                s = 'fa fa-star-o pt-star';                                
            }

            if (self.editable) {
                s = s + ' pt-star-editable';
            }

            return s;
        }

        public setRating(star: number) {
            var self = this;

            if (!self.orderId) {
                return;
            }

            if (!self.editable) {
                return;
            }

            self._dataService.postItem('KayttajaTilaus/addRating/' + self.orderId + '?userId=' + self._loginService.userId, { rating: star }).
                then(data => {
                    if (star > 1 && self.rating === star) {
                        star--;
                    }
                    self.rating = star;
                });
        }

        get showRating() {
            var self = this;
            return self.rating > 0 || self.orderId;
        }
    }

    app.component("ptRatingStars", {
        bindings: {
            rating: '<',
            editable: '<',
            orderId: '<'
        },
        template:
        `
        <div class="pt-star-container">
            <div ng-if="$ctrl.showRating">
                <i ng-class="$ctrl.getCssClassForStar(1)" ng-click="$ctrl.setRating(1)"></i>
                <i ng-class="$ctrl.getCssClassForStar(2)" ng-click="$ctrl.setRating(2)"></i>
                <i ng-class="$ctrl.getCssClassForStar(3)" ng-click="$ctrl.setRating(3)"></i>
                <i ng-class="$ctrl.getCssClassForStar(4)" ng-click="$ctrl.setRating(4)"></i>
                <i ng-class="$ctrl.getCssClassForStar(5)" ng-click="$ctrl.setRating(5)"></i>
            </div>
        </div>
        `,
        controller: RatingStarsController
    });
}
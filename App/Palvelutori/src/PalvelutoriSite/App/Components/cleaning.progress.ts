namespace Palvelutori {
    class CleaningProgressController {
        /**
         * Currently selected step.
         */
        public step: number;

        /**
         * Gets a CSS class for the specified step.
         */
        public getCssClassForStep(step: number): string {
            if (step < this.step) {
                return "pt-cleaning-progress-done";
            }
            else if (step === this.step) {
                return "pt-cleaning-progress-current";
            } else {
                return "pt-cleaning-progress-todo";
            }
        }

        public getCssClassForStepSmall(step: number): string {
            if (step < this.step) {
                return "pt-cleaning-progress-small-done";
            }
            else if (step === this.step) {
                return "pt-cleaning-progress-small-current";
            } else {
                return "pt-cleaning-progress-small-todo";
            }
        }
    }

    app.component("ptCleaningProgress", {
        bindings: {
            step: '<'
        },
        templateUrl: () => getUrl('/Components/CleaningProgress'),
        controller: CleaningProgressController
    });
}
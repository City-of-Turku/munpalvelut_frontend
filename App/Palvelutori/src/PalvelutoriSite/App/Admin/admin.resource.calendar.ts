namespace Palvelutori {
    class AdminResourceCalendarController {

        /**
         * Does the view contain any unsaved data?
         */
        public isDirty: boolean = false;

        /**
         * A resource calendar for a selected month.
         */
        public calendar: IResourceCalendar = null;

        static $inject = ["ptAdmin", "ptInfoService"];

        constructor(private ptAdmin: AdminService,
                    private ptInfoService: InfoService) {
        }

        /**
         * Moves to the previous month.
         */
        public onPreviousMonthClicked() {
            var self = this;

            if (!self.isDirty) {
                self.ptInfoService.removeNotes();

                var year = self.calendar.year;
                var month = self.calendar.month;

                month--;
                if (month < 1) {
                    month = 12;
                    year--;
                }

                self.ptAdmin.getCalendarForMonth(year, month).then((data: IResourceCalendar) => {
                    self.setCalendar(data);
                });
            } else {
                self.ptInfoService.addNote("Ole hyvä ja tallenna tai peruuta tekemäsi muutokset ensin.");
            }
        }

        /**
         * Moves to the next month.
         */
        public onNextMonthClicked() {         
            var self = this;

            if (!self.isDirty) {
                self.ptInfoService.removeNotes();

                var year = self.calendar.year;
                var month = self.calendar.month;

                month++;
                if (month > 12) {
                    month = 1;
                    year++;
                }

                self.ptAdmin.getCalendarForMonth(year, month).then((data: IResourceCalendar) => {
                    self.setCalendar(data);
                });
            } else {
                self.ptInfoService.addNote("Ole hyvä ja tallenna tai peruuta tekemäsi muutokset ensin.");                
            }
        }

        /**
         * Undos all changes.
         */
        public undoChanges() {
            var self = this;

            self.ptInfoService.removeNotes();

            var year = self.calendar.year;
            var month = self.calendar.month;

            self.ptAdmin.getCalendarForMonth(year, month).then((data: IResourceCalendar) => {
                self.setCalendar(data);
            });                           
        }

        /**
         * Saves changes.
         */
        public saveChanges() {
            var self = this;
            self.ptInfoService.removeNotes();

            self.ptAdmin.saveCalendar(this.calendar).then((data: IResourceCalendar) => {
                self.setCalendar(data);
                self.ptInfoService.addNote("Tiedot tallennettu!");
            });                           
        }

        /**
         * Occurs when the user has clicked the timeslot.
         */
        public onTimeslotClicked(day: IResourceCalendarDay, resource: IResourceCalendarResource, timeslot: IResourceCalendarDayTimeslot) {
            var rememberHistory: boolean = true;

            if (timeslot.isSelected) {
                timeslot.isSelected = false;
                rememberHistory = false;
            } else {
                timeslot.isSelected = true;

                if (resource.previouslyClickedTimeslot != null && resource.previouslyClickedTimeslot !== timeslot) {
                    var range: IResourceCalendarDayTimeslot[] = this.getTimeslotRange(resource, resource.previouslyClickedTimeslot.minutes, timeslot.minutes);
                    for (var i = 0; i < range.length; i++) {
                        range[i].isSelected = true;
                    }
                    rememberHistory = false;
                }
            }

            if (rememberHistory) {
                resource.previouslyClickedTimeslot = timeslot;
            } else {
                resource.previouslyClickedTimeslot = null;
            }

            this.isDirty = true;
        }

        public getCssClassForResource(day: IResourceCalendarDay, resource: IResourceCalendarResource): string {
            var css: string = 'pt-admin-calendar-resource';
            if (day.isWeekend) {
                css = `${css} pt-admin-calendar-resource-weekend`;                                
            }
            return css;
        }

        /**
         * Gets a css class for the specified timeslot.
         */
        public getCssClassForTimeslot(day: IResourceCalendarDay, timeslot: IResourceCalendarDayTimeslot): string {
            var css: string;
            
            if (timeslot.isEven) {
                css = 'pt-admin-calendar-timeslot-container-even';
            } else {
                css = 'pt-admin-calendar-timeslot-container-odd';
            }

            if (day.isWeekend) {
                css = `${css} pt-admin-calendar-timeslot-container-weekend`;                
            }

            if (timeslot.isSelected) {
                css = `${css} pt-admin-calendar-timeslot-container-inside`;
            }

            return css;
        }

        public getCssClassForDayinfo(day: IResourceCalendarDay): string {
            var css: string = 'pt-admin-calendar-dayinfo-container';
            if (day.isWeekend) {
                css = `${css} pt-admin-calendar-dayinfo-container-weekend`;
            }            
            return css;
        }


        private setCalendar(calendar: IResourceCalendar) {            
            this.calendar = calendar;
            this.isDirty = false;
        }

        /**
         * Gets all timeslot between the specified minute range.
         */
        private getTimeslotRange(resource: IResourceCalendarResource, fromMinutes: number, untilMinutes: number): IResourceCalendarDayTimeslot[] {
            var range: IResourceCalendarDayTimeslot[] = [];

            if (fromMinutes <= untilMinutes) {
                for (var i = 0; i < resource.timeslots.length; i++) {
                    if (resource.timeslots[i].minutes >= fromMinutes && resource.timeslots[i].minutes <= untilMinutes) {
                        range.push(resource.timeslots[i]);
                    }
                }
            } else {
                for (var j = resource.timeslots.length - 1; j >= 0; j--) {
                    if (resource.timeslots[j].minutes <= fromMinutes && resource.timeslots[j].minutes >= untilMinutes) {
                        range.push(resource.timeslots[j]);
                    }
                }
            }

            return range;
        }
    }

    app.component("ptAdminResourceCalendar", {
        bindings: {
            calendar: '<'
        },
        transclude: true,
        templateUrl: () => getUrl('/Admin/AdminResourceCalendar'),
        controller: AdminResourceCalendarController
    });

    // Configure route
    app.config(($routeProvider: angular.route.IRouteProvider) => {
        $routeProvider.when('/admin/resourcecalendar', {
            template: '<pt-admin-resource-calendar calendar="$resolve.calendar"></pt-admin-resource-calendar>',
            resolve: {
                calendar: function (ptAdmin: AdminService) {
                    return ptAdmin.getCalendar();
                }
            }
        });
    });

}
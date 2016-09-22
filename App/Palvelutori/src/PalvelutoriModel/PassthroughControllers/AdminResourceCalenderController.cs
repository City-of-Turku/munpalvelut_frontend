using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PalvelutoriModel.Caching;
using PalvelutoriModel.Calendar;
using PalvelutoriModel.Search;

namespace PalvelutoriModel.PassthroughControllers
{
    public class AdminResourceCalenderController : PassthroughBaseController
    {
        private DjangoCache Cache { get; }

        public AdminResourceCalenderController(BFContext context, DjangoCache cache) : base("calendarentries/", context)
        {
            Cache = cache;
        }

        [HttpPost("GetResourceCalendar")]
        public async Task<ResourceCalendar> GetResourceCalendar([FromBody] ResourceCalendarRequest request)
        {
            return await GetResourceCalendar(request.CompanyId, request.Year, request.Month);
        }

        [HttpPost("SaveResourceCalendar")]
        public async Task<ResourceCalendar> SaveResourceCalendar([FromBody] ResourceCalendar calendar)
        {
            await UpdateCalendar(calendar);
            return await GetResourceCalendar(calendar.CompanyId, calendar.Year, calendar.Month);
        }

        private async Task UpdateCalendar(ResourceCalendar calendar)
        {
            Cache.ClearAll();

            DjangoCalendar dc = await GetDjangoCalendar(calendar);
            foreach (var newEntry in ParseEntries(calendar))
            {
                var old = dc.Results.FirstOrDefault(row => row.Start == newEntry.Start && row.End == newEntry.End);
                if (old != null)
                {
                    old.Used = true;
                }
                else
                {
                    dc.Results.Add(newEntry);
                }
            }
            foreach (var entry in dc.Results)
            {
                if (entry.ID != null && entry.Used)
                    continue;
                if (entry.ID != null)
                {
                    await DeleteItem(entry.ID);
                }
                else
                {
                    await PostJson("calendarentries/", Serialize(entry));
                }
            }
        }

        private IEnumerable<DjangoTimeEntry> ParseEntries(ResourceCalendar calendar)
        {
            foreach (var day in calendar.Days)
            {
                foreach (var res in day.Resources)
                {
                    DateTime? startTime = null;
                    foreach (var tick in res.Timeslots)
                    {
                        if (tick.IsSelected)
                        {
                            if (!startTime.HasValue)
                            {
                                startTime = new DateTime(calendar.Year, calendar.Month, day.DayNro, tick.Minutes / 60, tick.Minutes % 60, 0, DateTimeKind.Utc);
                            }
                        }
                        else
                        {
                            if (startTime.HasValue)
                            {
                                var endTime = new DateTime(calendar.Year, calendar.Month, day.DayNro, tick.Minutes / 60, tick.Minutes % 60, 0, DateTimeKind.Utc);
                                var dc = new DjangoTimeEntry() { CompanyID = calendar.CompanyId, Start = startTime.Value, End = endTime, Used = true };
                                startTime = null;
                                yield return dc;
                            }
                        }
                    }
                    if (startTime.HasValue)
                    {
                        var endTime = new DateTime(calendar.Year, calendar.Month, day.DayNro, 23, 59, 0, DateTimeKind.Utc);
                        var dc = new DjangoTimeEntry() { CompanyID = calendar.CompanyId, Start = startTime.Value, End = endTime, Used = true };
                        startTime = null;
                        yield return dc;
                    }
                }
            }
        }

        private async Task<ResourceCalendar> GetResourceCalendar(string companyId, int year, int month)
        {
            var calendar = CreateEmptyResourceCalendar(companyId, year, month);
            await FillResourceCalendar(calendar);
            return calendar;
        }

        private ResourceCalendar CreateEmptyResourceCalendar(string companyId, int year, int month)
        {
            var culture = GetRequestCulture();

            var resources = GetResources(companyId, year, month);

            var calendar = new ResourceCalendar();

            calendar.Year = year;
            calendar.Month = month;
            calendar.CompanyId = companyId;
            calendar.MonthName = GetMonthName(month, culture);

            var moment = new DateTime(year, month, 1);

            while (moment.Month == month)
            {
                var dow = moment.DayOfWeek;

                var day = new ResourceCalendarDay();
                day.Day = moment.ToString("dd.MM.yyyy");
                day.DayNro = moment.Day;
                day.Weekday = GetWeekday(dow, culture);
                day.IsWeekend = dow == DayOfWeek.Saturday || dow == DayOfWeek.Sunday;
                day.Resources = Clone(resources);

                calendar.Days.Add(day);

                moment = moment.AddDays(1);
            }

            return calendar;
        }

        private List<ResourceCalendarResource> GetResources(string companyId, int year, int month)
        {
            var timeslots = CreateEmptyTimeslots();

            var resources = new List<ResourceCalendarResource>();

            resources.Add(new ResourceCalendarResource { Id = 1, Name = "Yritys", Timeslots = Clone(timeslots) });

            return resources;
        }

        private static string GetMonthName(int month, CultureInfo culture)
        {
            switch (month)
            {
                case 1:
                    return "Tammikuu";
                case 2:
                    return "Helmikuu";
                case 3:
                    return "Maaliskuu";
                case 4:
                    return "Huhtikuu";
                case 5:
                    return "Toukokuu";
                case 6:
                    return "Kesäkuu";
                case 7:
                    return "Heinäkuu";
                case 8:
                    return "Elokuu";
                case 9:
                    return "Syyskuu";
                case 10:
                    return "Lokakuu";
                case 11:
                    return "Marraskuu";
                case 12:
                    return "Joulukuu";
                default:
                    throw new ArgumentOutOfRangeException(nameof(month));
            }
        }

        private static string GetWeekday(DayOfWeek day, CultureInfo culture)
        {
            switch (day)
            {
                case DayOfWeek.Sunday:
                    return "SU";
                case DayOfWeek.Monday:
                    return "MA";
                case DayOfWeek.Tuesday:
                    return "TI";
                case DayOfWeek.Wednesday:
                    return "KE";
                case DayOfWeek.Thursday:
                    return "TO";
                case DayOfWeek.Friday:
                    return "PE";
                case DayOfWeek.Saturday:
                    return "LA";
                default:
                    throw new ArgumentOutOfRangeException(nameof(day), day, null);
            }
        }

        private static List<ResourceCalendarDayTimeslot> CreateEmptyTimeslots()
        {
            var l = new List<ResourceCalendarDayTimeslot>();

            var isEven = true;

            for (var minutes = 0; minutes < 1440; minutes = minutes + 30)
            {
                var time = TimeSpan.FromMinutes(minutes);

                var hh = "0" + time.Hours;
                hh = hh.Substring(hh.Length - 2, 2);

                var mm = "0" + time.Minutes;
                mm = mm.Substring(mm.Length - 2, 2);

                var text = hh + ":" + mm;

                l.Add(new ResourceCalendarDayTimeslot
                {
                    Minutes = minutes,
                    Text = text,
                    IsEven = isEven,
                    IsSelected = false
                });

                isEven = !isEven;
            }

            return l;
        }

        private async Task FillResourceCalendar(ResourceCalendar calendar)
        {
            DjangoCalendar dc = await GetDjangoCalendar(calendar);
            foreach (var reserved in dc.Results)
            {
                reserved.Start = reserved.Start;
                reserved.End = reserved.End;
                FillReserved(reserved, calendar);
            }
        }

        private async Task<DjangoCalendar> GetDjangoCalendar(ResourceCalendar calendar)
        {
            var startTime = SearchController.ToUTC(new DateTime(calendar.Year, calendar.Month, 1), 0);
            var endTime = SearchController.ToUTC(new DateTime(calendar.Year + (calendar.Month == 12 ? 1 : 0), calendar.Month < 12 ? calendar.Month + 1 : 1, 1), 0);
            var entries = await GetJson($"calendarentries?company={calendar.CompanyId}&start__gt={startTime}&end__lt={endTime}&limit=100000");
            var dc = Deserialize<DjangoCalendar>(entries);
            return dc;
        }

        private void FillReserved(DjangoTimeEntry reserved, ResourceCalendar calendar)
        {
            var dayNro = reserved.Start.Day;
            var beginDay = new DateTime(reserved.Start.Year, reserved.Start.Month, reserved.Start.Day);
            var day = calendar.Days.First(row => row.DayNro == dayNro);
            int startMin = (int)((reserved.Start - beginDay).TotalMinutes);
            int endMin = (int)((reserved.End - beginDay).TotalMinutes);
            foreach (var res in day.Resources)
            {
                foreach (var ts in res.Timeslots)
                {
                    if (ts.Minutes >= startMin && ts.Minutes < endMin)
                    {
                        ts.IsSelected = true;
                    }
                }
            }
        }

        private static T Clone<T>(T obj)
        {
            var json = JsonConvert.SerializeObject(obj);
            var clone = JsonConvert.DeserializeObject<T>(json);
            return clone;
        }
    }
}

using System.Collections.Generic;
using Newtonsoft.Json;

namespace PalvelutoriModel.Calendar
{
    public class ResourceCalendarRequest
    {
        [JsonProperty("year")]
        public int Year { get; set; }

        [JsonProperty("month")]
        public int Month { get; set; }

        [JsonProperty("companyId")]
        public string CompanyId { get; set; }

    }

    public class ResourceCalendar
    {

        [JsonProperty("companyId")]
        public string CompanyId { get; set; }

        [JsonProperty("year")]
        public int Year { get; set; }

        [JsonProperty("month")]
        public int Month { get; set; }

        [JsonProperty("monthName")]
        public string MonthName { get; set; }

        [JsonProperty("days")]
        public List<ResourceCalendarDay> Days { get; set; } = new List<ResourceCalendarDay>();
    }

    public class ResourceCalendarDay
    {
        [JsonProperty("day")]
        public string Day { get; set; }

        [JsonProperty("weekday")]
        public string Weekday { get; set; }

        [JsonProperty("isWeekend")]
        public bool IsWeekend { get; set; }

        [JsonProperty("resources")]
        public List<ResourceCalendarResource> Resources { get; set; } = new List<ResourceCalendarResource>();

        [JsonProperty("dayNro")]
        public int DayNro { get; set; }
    }

    public class ResourceCalendarResource
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("timeslots")]
        public List<ResourceCalendarDayTimeslot> Timeslots { get; set; } = new List<ResourceCalendarDayTimeslot>();
    }

    public class ResourceCalendarDayTimeslot
    {
        [JsonProperty("minutes")]
        public int Minutes { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("isEven")]
        public bool IsEven { get; set; }

        [JsonProperty("isSelected")]
        public bool IsSelected { get; set; }
    }
}

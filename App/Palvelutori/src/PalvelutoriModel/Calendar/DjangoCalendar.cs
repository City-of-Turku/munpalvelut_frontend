using Newtonsoft.Json;
using System.Collections.Generic;

namespace PalvelutoriModel.Calendar
{
    public class DjangoCalendar
    {
        [JsonProperty("results")]
        public List<DjangoTimeEntry> Results { get; set; }
    }
}

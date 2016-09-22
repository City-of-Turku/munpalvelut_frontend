using System;
using Newtonsoft.Json;

namespace PalvelutoriModel.Calendar
{
    public class DjangoTimeEntry
    {
        [JsonProperty("id")]
        public string ID { get; set; }

        [JsonProperty("start")]
        public DateTime Start { get; set; }

        [JsonProperty("end")]
        public DateTime End { get; set; }

        [JsonProperty("company")]
        public string CompanyID { get; set; }

        /// <summary>
        /// Flag to keep usage on update
        /// </summary>
        [JsonIgnore]
        public bool Used { get; set; }
    }
}
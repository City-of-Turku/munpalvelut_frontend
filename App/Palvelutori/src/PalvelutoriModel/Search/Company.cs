using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.Search
{
    public class Company
    {
        [JsonProperty("id")]
        public string ID { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("businessid")]
        public string BusinessID { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("email")]
        public string EMail { get; set; }

        [JsonProperty("price_per_hour")]
        public double PricePerHour { get; set; }

        [JsonProperty("price_per_hour_continuing")]
        public double PricePerHourContinuing { get; set; }

        [JsonProperty("service_areas")]
        public List<string> ServiceAreas { get; set; }

        [JsonProperty("description")]
        public Dictionary<string,string> Descriptions { get; set; }

        [JsonProperty("shortdescription")]
        public Dictionary<string, string> ShortDescriptions { get; set; }

        [JsonProperty("psop")]
        public bool PSOP { get; set; }

        [JsonProperty("rating")]
        public decimal? Rating { get; set; }

        [JsonProperty("links")]

        public List<CompanyLink> Links { get; set; }

        [JsonProperty("offered_services")]
        public List<long> OfferedServices { get; set; }

        [JsonProperty("addresses")]
        public List<CompanyAddress> Addresses { get; set; }


    }

    public class CompanyAddress {
        [JsonProperty("streetAddress")]
        public string StreetAddress { get; set; }

        [JsonProperty("streetAddress2")]
        public string StreetAddress2 { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("postalcode")]
        public string Postalcode { get; set; }


    }

    public class CompanyLink {
        [JsonProperty("linktype")]
        public string Linktype { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

    }
}

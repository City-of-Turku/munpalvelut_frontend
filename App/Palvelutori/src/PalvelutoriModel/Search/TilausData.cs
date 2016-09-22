using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.Search
{
    public class TilausData
    {

        [JsonProperty("aika")]
        public Aika Aika { get; set; }

        [JsonProperty("paiva")]
        public string Paiva { get; set; }

        [JsonProperty("paketti")]
        public PalveluPaketti Paketti { get; set; }

        [JsonProperty("kohde")]
        public KohdeTiedot Kohde { get; set; }

        [JsonProperty("me")]
        public KayttajaTiedot Me { get; set; }

        [JsonProperty("yritys")]
        public YritysTiedot Yritys { get; set; }

        /// <summary>
        /// Hinta euroina
        /// </summary>
        [JsonProperty("hinta2")]
        public double Hinta2 { get; set; }

        /// <summary>
        /// Kesto tunteina
        /// </summary>
        [JsonProperty("kesto")]
        public double Kesto { get; set; }


        [JsonProperty("lisatiedot")]
        public string Lisatiedot { get; set; }

    }
}

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.Search
{
    /// <summary>
    /// Must match with ISearchData from client
    /// </summary>
    public class SearchData
    {
        [JsonProperty("aika")]
        public Aika Aika { get; set; }

        [JsonProperty("paiva")]
        public string Paiva { get; set; }

        [JsonProperty("paketti")]
        public PalveluPaketti Paketti { get; set; }

        [JsonProperty("kohde")]
        public KohdeTiedot Kohde { get; set;  }
    }

    public class YritysTiedot {
        [JsonProperty("ID")]
        public double ID { get; set; }

    }

    public class KohdeTiedot {
        [JsonProperty("floor_area")]
        public double FloorArea { get; set; }

        [JsonProperty("address_street")]
        public string AddressStreet1 { get; set; }

        [JsonProperty("address_street2")]
        public string AddressStreet2 { get; set; }

        [JsonProperty("address_postalcode")]
        public string AddressPostalcode { get; set; }

        [JsonProperty("address_city")]
        public string AddressCity { get; set; }

        [JsonProperty("room_count")]
        public int RoomCount { get; set; }

        [JsonProperty("sanitary_count")]
        public int SanitaryCount { get; set; }

        [JsonProperty("floor_count")]
        public int FloorCount { get; set; }

    }

    public class KayttajaTiedot {
        [JsonProperty("first_name")]
        public string FirstName { get; set; }

        [JsonProperty("last_name")]
        public string LastName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

    }

    public class PalveluPaketti {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("shortname")]
        public string ShortName { get; set; }
    }

    public class Aika {
        [JsonProperty("from")]
        public int From { get; set;  }

        [JsonProperty("to")]
        public int To { get; set; }
    }
    /*
    export interface ISearchData {
        kohde: IKohde;
        paiva: string;
        aika: string;
        paketti: IPackage;

    }
    */
}

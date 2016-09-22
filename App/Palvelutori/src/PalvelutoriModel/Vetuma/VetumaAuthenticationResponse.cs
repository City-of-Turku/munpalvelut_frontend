using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.Vetuma
{
    /// <summary>
    /// 2.7 Vetuma-vastausten yleiset parametrit
    /// 
    /// http://www.suomi.fi/suomifi/tyohuone/yhteiset_palvelut/verkkotunnistaminen_ja_maksaminen_vetuma/tekninen_rajapinta/Vetuma_v_3_5_tekninen_rajapinta/02_Vetuma_palvelun_kutsurajapinnan_maarittely_v_3_5_1/Vetuma_palvelun_kutsurajapinnan_maarittely_v_3_5_1.pdf
    /// </summary>
    public class VetumaAuthenticationResponse
    {
        public enum VetumaAuthenticationStatus
        {
            Successful = 1,
            Cancelled = 2,
            Rejected = 3,
            Error = 4,
            Failure = 5
        }

        /// <summary>
        /// Ilmaisee operaation tilan.
        /// </summary>
        public VetumaAuthenticationStatus Status { get; set; }

        /// <summary>
        /// Tapahtumatunnus
        /// </summary>
        /// <remarks>
        /// Tämän avulla vastaus voidaan kohdistaa pyyntöön.
        /// </remarks>
        public string TRID { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PersonId { get; set; }
    }
}

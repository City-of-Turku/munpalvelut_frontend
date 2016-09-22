using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.Vetuma
{
    /// <summary>
    /// 2.6 Vetuma-kutsujen yleiset parametrit
    /// 
    /// http://www.suomi.fi/suomifi/tyohuone/yhteiset_palvelut/verkkotunnistaminen_ja_maksaminen_vetuma/tekninen_rajapinta/Vetuma_v_3_5_tekninen_rajapinta/02_Vetuma_palvelun_kutsurajapinnan_maarittely_v_3_5_1/Vetuma_palvelun_kutsurajapinnan_maarittely_v_3_5_1.pdf
    /// </summary>
    public class VetumaAuthenticateRequest
    {
        /// <summary>
        /// Vetuma-palvelun verkko-osoite. 
        /// Tuotanto- ja testiympäristöillä on omat osoitteensa.
        /// </summary>
        public string ServiceUrl { get; set; }

        /// <summary>
        /// Kutsun suojauksessa käytetyn jaetun salaisuuden tunnus
        /// </summary>
        public string RCVID { get; set; }

        /// <summary>
        /// Vetuma-palvelua kutsuvan asiointisovelluksen tunnus
        /// </summary>
        public string APPID { get; set; }

        /// <summary>
        /// Kutsun aikaleima
        /// </summary>
        public string TIMESTMP { get; set; }

        /// <summary>
        /// Oletusmenetelmä
        /// </summary>
        public string SO { get; set; }

        /// <summary>
        /// Käyttäjälle tarjottavat menetelmät 
        /// </summary>
        public string SOLIST { get; set; }

        /// <summary>
        /// Käytettävän Vetuma-palvelun tyypin tunnus
        /// </summary>
        public string TYPE { get; set; }

        /// <summary>
        /// Kutsussa pyydettävän toiminnon koodi.
        /// </summary>
        public string AU { get; set; }

        /// <summary>
        /// Käyttöliittymäkieli
        /// </summary>
        public string LG { get; set; }

        /// <summary>
        /// Paluuosoite sovellukseen onnistuneen tapahtuman jälkeen
        /// </summary>
        public string RETURL { get; set; }

        /// <summary>
        /// Paluuosoite sovellukseen käyttäjän peruman tapahtuman jälkeen
        /// </summary>
        public string CANURL { get; set; }

        /// <summary>
        /// Virhepaluuosoite sovellukseen
        /// </summary>
        public string ERRURL { get; set; }

        /// <summary>
        /// Kutsun palvelemisessa käytettävän konfiguraation tunnus
        /// </summary>
        public string AP { get; set; }

        /// <summary>
        /// VTJ-kyselypyyntö.
        /// EXTRADATA-parametrin arvolla ”VTJ1” voidaan pyytää HETU:n noutamista VTJ:stä jos
        /// käyttäjä suorittaa toiminnon kansalaisvarmenteeseen perustuvalla menetelmällä josta saadaan
        /// käyttäjän tunnisteeksi SATU.
        /// </summary>
        public string EXTRADATA { get; set; }

        /// <summary>
        /// Kutsun turvatarkiste (MAC)
        /// </summary>
        public string MAC { get; set; }

        /// <summary>
        /// Tapahtumatunnus
        /// </summary>
        /// <remarks>
        /// Tämän avulla vastaus voidaan kohdistaa pyyntöön.
        /// </remarks>
        public string TRID { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace PalvelutoriModel.Vetuma
{
    public class VetumaEnvironment
    {
        public VetumaEnvironment(IConfigurationRoot configuration)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            ServiceUrl = configuration["VetumaServiceUrl"];
            MACKey = configuration["VetumaMACKey"];
            RCVID = configuration["VetumaRCVID"];
            RETURL = configuration["VetumaRETURL"];
            CANURL = configuration["VetumaCANURL"];
            ERRURL = configuration["VetumaERRURL"];
            AP = configuration["VetumaAP"];
        }

        /// <summary>
        /// Vetuma-palvelun verkko-osoite. 
        /// Tuotanto- ja testiympäristöillä on omat osoitteensa.
        /// </summary>
        public string ServiceUrl { get; private set; }

        public string MACKey { get; private set; }

        /// <summary>
        /// Kutsun suojauksessa käytetyn jaetun salaisuuden tunnus
        /// </summary>
        public string RCVID { get; private set; }

        /// <summary>
        /// Paluuosoite sovellukseen onnistuneen tapahtuman jälkeen
        /// </summary>
        public string RETURL { get; private set; }

        /// <summary>
        /// Paluuosoite sovellukseen käyttäjän peruman tapahtuman jälkeen
        /// </summary>
        public string CANURL { get; private set; }

        /// <summary>
        /// Virhepaluuosoite sovellukseen
        /// </summary>
        public string ERRURL { get; private set; }

        /// <summary>
        /// Kutsun palvelemisessa käytettävän konfiguraation tunnus
        /// </summary>
        public string AP { get; private set; }

    }
}

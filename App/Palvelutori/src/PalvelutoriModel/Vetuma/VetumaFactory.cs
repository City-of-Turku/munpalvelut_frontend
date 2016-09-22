using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace PalvelutoriModel.Vetuma
{
    public class VetumaFactory : IVetumaFactory
    {
        private VetumaEnvironment VetumaEnvironment { get; set; }

        public VetumaFactory(VetumaEnvironment vetumaEnvironment)
        {
            VetumaEnvironment = vetumaEnvironment;
        }

        public static string ByteArrayToString(byte[] ba)
        {
            StringBuilder hex = new StringBuilder(ba.Length * 2);
            foreach (byte b in ba)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }

        public VetumaAuthenticateRequest CreateAuthenticationRequest(string trid, CultureInfo culture)
        {
            if (trid == null)
            {
                throw new ArgumentNullException(nameof(trid));
            }

            var request = new VetumaAuthenticateRequest();

            // Vetuma-palvelun verkko-osoite.
            request.ServiceUrl = VetumaEnvironment.ServiceUrl;

            // RCVID
            // Kutsun suojauksessa käytetyn jaetun salaisuuden tunnus
            request.RCVID = VetumaEnvironment.RCVID;

            // APPID
            // Vetuma-palvelua kutsuvan asiointisovelluksen tunnus
            request.APPID = "Palvelutori";

            // TIMESTMP
            // Kutsun aikaleima
            request.TIMESTMP = TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("FLE Standard Time")).ToString("yyyyMMddHHmmssfff");

            // SO
            // Oletusmenetelmä
            request.SO = "6";

            // SOLIST
            // Käyttäjälle tarjottavat menetelmät
            request.SOLIST = "2,6";

            // TYPE
            // Käytettävän Vetuma-palvelun tyypin tunnus
            request.TYPE = "LOGIN";

            // AU
            // Kutsussa pyydettävän toiminnon koodi.
            request.AU = "EXTAUTH";

            // LG
            // Käyttöliittymäkieli
            string lg;
            switch (culture.Name)
            {
                case "fi-FI":
                    lg = "fi";
                    break;
                case "sv-FI":
                    lg = "sv";
                    break;
                default:
                    throw new InvalidOperationException($"The specified culture '{culture.Name}' is not supported for this request.");
            }
            request.LG = lg;

            // RETURL
            // Paluuosoite sovellukseen onnistuneen tapahtuman jälkeen
            request.RETURL = VetumaEnvironment.RETURL;

            // CANURL
            // Paluuosoite sovellukseen käyttäjän peruman tapahtuman jälkeen
            request.CANURL = VetumaEnvironment.CANURL;

            // ERRURL
            // Virhepaluuosoite sovellukseen
            request.ERRURL = VetumaEnvironment.ERRURL;

            // AP
            // Kutsun palvelemisessa käytettävän konfiguraation tunnus
            request.AP = VetumaEnvironment.AP;

            // EXTRADATA
            request.EXTRADATA = "VTJ1";

            // TRID
            // Tapahtumatunnus
            request.TRID = trid;

            // MAC
            // Kutsun turvatarkiste (MAC)
            request.MAC = GetMAC(
                VetumaEnvironment.MACKey,
                request.RCVID,
                request.APPID,
                request.TIMESTMP,
                request.SO,
                request.SOLIST,
                request.TYPE,
                request.AU,
                request.LG,
                request.RETURL,
                request.CANURL,
                request.ERRURL,
                request.AP,
                request.EXTRADATA,
                request.TRID);

            return request;
        }

        public VetumaAuthenticationResponse ParseResponse(IFormCollection form)
        {
            if (form == null)
            {
                throw new ArgumentNullException(nameof(form));
            }

            VetumaAuthenticationResponse response = new VetumaAuthenticationResponse();

            // STATUS
            var status = GetFormField(form, "STATUS");
            if (status == null)
            {
                throw new InvalidOperationException("STATUS is not available.");
            }
            switch (status)
            {
                case "SUCCESSFUL":
                    response.Status = VetumaAuthenticationResponse.VetumaAuthenticationStatus.Successful;
                    break;
                case "CANCELLED":
                    response.Status = VetumaAuthenticationResponse.VetumaAuthenticationStatus.Cancelled;
                    break;
                case "REJECTED":
                    response.Status = VetumaAuthenticationResponse.VetumaAuthenticationStatus.Rejected;
                    break;
                case "ERROR":
                    response.Status = VetumaAuthenticationResponse.VetumaAuthenticationStatus.Error;
                    break;
                case "FAILURE":
                    response.Status = VetumaAuthenticationResponse.VetumaAuthenticationStatus.Failure;
                    break;
                default:
                    throw new InvalidOperationException("Invalid status.");
            }

            // TRID
            response.TRID = GetFormField(form, "TRID");

            if (status == "SUCCESSFUL")
            {
                // SUBJECTDATA
                var firstName = string.Empty;
                var lastName = string.Empty;
                var subjectData = GetFormField(form, "SUBJECTDATA");
                if (!string.IsNullOrEmpty(subjectData))
                {
                    var subjectDataTokens = subjectData.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var token in subjectDataTokens)
                    {
                        var subjectDataSubTokens = token.Split(new[] { '=' }, StringSplitOptions.RemoveEmptyEntries);
                        if (subjectDataSubTokens.Length == 2)
                        {
                            if (subjectDataSubTokens[0].Trim() == "ETUNIMI")
                            {
                                firstName = subjectDataSubTokens[1];
                            }
                            else if (subjectDataSubTokens[0].Trim() == "SUKUNIMI")
                            {
                                lastName = subjectDataSubTokens[1];
                            }
                        }
                    }
                }
                response.FirstName = firstName;
                response.LastName = lastName;

                // EXTRADATA
                var personId = string.Empty;
                var extraData = GetFormField(form, "EXTRADATA");
                if (!string.IsNullOrEmpty(extraData))
                {
                    var extraDataTokens = extraData.Split(new[] { '=' }, StringSplitOptions.RemoveEmptyEntries);
                    if (extraDataTokens.Length == 2)
                    {
                        if (extraDataTokens[0] == "HETU")
                        {
                            personId = extraDataTokens[1];
                        }
                    }
                }
                response.PersonId = personId;
            }

            return response;
        }

        /// <summary>
        /// Key: TRID
        /// Value: Response when available. Null when not yet available.
        /// </summary>
        private static readonly ConcurrentDictionary<string, VetumaAuthenticationResponse> _createdTRIDsForRegistration = new ConcurrentDictionary<string, VetumaAuthenticationResponse>();

        /// <summary>
        /// Key: TRID
        /// Value: Response when available. Null when not yet available.
        /// </summary>
        private static readonly ConcurrentDictionary<string, VetumaAuthenticationResponse> _createdTRIDsForPasswordRecovery = new ConcurrentDictionary<string, VetumaAuthenticationResponse>();

        public ConcurrentDictionary<string, VetumaAuthenticationResponse> CreatedTRIDsForRegistration
        {
            get
            {
                return _createdTRIDsForRegistration;
            }
        }

        public ConcurrentDictionary<string, VetumaAuthenticationResponse> CreatedTRIDsForPasswordRecovery
        {
            get
            {
                return _createdTRIDsForPasswordRecovery;
            }
        }

        public string GetVetumaTokenForPersonId(string personId)
        {
            if (personId == null)
            {
                throw new ArgumentNullException(nameof(personId));
            }

            if (string.IsNullOrEmpty(personId))
            {
                throw new ArgumentException("value cannot be null or empty string", nameof(personId));
            }

            var vetumaToken = "DONE:" + Sign(personId);
            return vetumaToken;
        }

        private static string Sign(string value)
        {
            using (var sha256 = SHA256.Create())
            {
                var buffer = Encoding.UTF8.GetBytes(value);
                var hash = sha256.ComputeHash(buffer);
                StringBuilder sb = new StringBuilder();
                foreach (var bt in hash)
                {
                    sb.AppendFormat("{0:x02}", bt);
                }
                return sb.ToString();
            }
        }

        private static string GetFormField(IFormCollection form, string name)
        {
            var values = form[name];
            if (values.Count == 1)
            {
                var value = values[0];
                return value;
            }
            return null;
        }

        private static string GetMAC(string key, params string[] values)
        {
            var data = new StringBuilder();

            foreach (var value in values)
            {
                data.Append($"{value}&");
            }

            data.Append($"{key}&");

            var mac = Hash(data.ToString());
            return mac;
        }

        private static string Hash(string data)
        {
            byte[] bytes;
            using (var algorithm = System.Security.Cryptography.SHA256.Create())
            {
                bytes = algorithm.ComputeHash(Encoding.ASCII.GetBytes(data));
            }

            var hex = new StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
            {
                hex.AppendFormat("{0:x2}", b);
            }

            var hash = hex.ToString();
            hash = hash.ToUpper();
            return hash;
        }

    }
}

using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PalvelutoriModel.Vetuma;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class NewKayttajaController : PassthroughBaseController
    {
        private IVetumaFactory Vetuma { get; }

        public NewKayttajaController(BFContext context, IVetumaFactory vetuma) : base("users/", context)
        {
            Vetuma = vetuma;
        }

        [HttpGet]
        public Task<JObject> Create(string contextId = null)
        {
            return Task.FromResult(Serialize(new NewUser()));
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] NewUser body)
        {
            if (body == null)
            {
                throw new ArgumentException("Invalid user");
            }

            if (body.Password1 != body.Password2)
            {
                ModelState.AddModelError("salasana1", "Tarkista salasana.");
            }

            if (!IsValidEmail(body.EMail))
            {
                ModelState.AddModelError("email", "Tarkista sähköpostiosoite.");
            }

            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            VetumaAuthenticationResponse vetuma;
            if (!Vetuma.CreatedTRIDsForRegistration.TryGetValue(body.TRID, out vetuma))
            {
                throw new InvalidOperationException($"Could not find VetumaAuthenticationResponse by using the TRID {body.TRID}");
            }

            var obj = JObject.Parse("{ phone: ' '}");
            obj.Add("first_name", vetuma.FirstName);
            obj.Add("last_name", vetuma.LastName);
            obj.Add("email", body.EMail);
            obj.Add("password", body.Password1);
            obj.Add("vetuma", Vetuma.GetVetumaTokenForPersonId(vetuma.PersonId));

            JObject result;

            try
            {
                result = await PostJson("users/", obj);
            }
            catch (DjangoFailedException ex)
            {
                if (ex.Body != null && ex.Body.Contains("This email address is already in use"))
                {
                    ModelState.AddModelError("email", "Sähköpostiosoite on jo käytössä.");
                    return new BadRequestObjectResult(ModelState);

                }
                return new BadRequestResult();
            }

            VetumaAuthenticationResponse removed;
            Vetuma.CreatedTRIDsForRegistration.TryRemove(body.TRID, out removed);

            return Json(result);
        }

        [HttpPost("beginVetumaForRegistration")]
        public virtual IActionResult BeginVetumaForRegistration()
        {
            var trid = Guid.NewGuid().ToString().Replace("-", string.Empty);
            trid = trid.Substring(0, 20);
            Vetuma.CreatedTRIDsForRegistration.TryAdd(trid, null);
            return Json(trid);
        }

        [HttpPost("endVetuma")]
        public IActionResult EndVetuma()
        {
            var response = Vetuma.ParseResponse(Request.Form);

            if (response.Status == VetumaAuthenticationResponse.VetumaAuthenticationStatus.Successful)
            {               
                VetumaAuthenticationResponse mustBeNull;

                if (!Vetuma.CreatedTRIDsForRegistration.ContainsKey(response.TRID) && 
                    !Vetuma.CreatedTRIDsForPasswordRecovery.ContainsKey(response.TRID))
                {
                    throw new InvalidOperationException($"Unknown trid {response.TRID}");
                }

                // Registration
                if (Vetuma.CreatedTRIDsForRegistration.ContainsKey(response.TRID))
                {
                    if (!Vetuma.CreatedTRIDsForRegistration.TryGetValue(response.TRID, out mustBeNull))
                    {
                        throw new InvalidOperationException($"Unknown trid {response.TRID}");
                    }

                    if (mustBeNull != null)
                    {
                        throw new InvalidOperationException($"Found old VetumaAuthenticationResponse by using the trid {response.TRID}");
                    }

                    Vetuma.CreatedTRIDsForRegistration.TryUpdate(response.TRID, response, null);

                    return new RedirectResult("/#/show/register2");
                }

                // Password recovery
                if (Vetuma.CreatedTRIDsForPasswordRecovery.ContainsKey(response.TRID))
                {
                    if (!Vetuma.CreatedTRIDsForPasswordRecovery.TryGetValue(response.TRID, out mustBeNull))
                    {
                        throw new InvalidOperationException($"Unknown trid {response.TRID}");
                    }

                    if (mustBeNull != null)
                    {
                        throw new InvalidOperationException($"Found old VetumaAuthenticationResponse by using the trid {response.TRID}");
                    }

                    Vetuma.CreatedTRIDsForPasswordRecovery.TryUpdate(response.TRID, response, null);

                    return new RedirectResult("/#/show/forgotpassword2");
                }
            }

            return new BadRequestObjectResult("Vetuma failed");
        }

        //private string GetRNDString()
        //{
        //    using (var sha256 = SHA256.Create())
        //    {
        //        var buffer = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString() + "Join muuta puppua");
        //        var hash = sha256.ComputeHash(buffer);
        //        StringBuilder sb = new StringBuilder();
        //        foreach (var bt in hash.Take(9))
        //        {
        //            sb.AppendFormat("{0:x02}", bt);
        //        }
        //        return sb.ToString();
        //    }
        //}

        private static bool IsValidEmail(string value)
        {
            var valid = false;
            if (!string.IsNullOrEmpty(value))
            {
                valid = new EmailAddressAttribute().IsValid(value);
            }
            return valid;
        }
    }

    public class NewUser
    {
        [JsonProperty("email")]
        public string EMail { get; set; }

        [JsonProperty("salasana1")]
        public string Password1 { get; set; }

        [JsonProperty("salasana2")]
        public string Password2 { get; set; }

        [JsonProperty("trid")]
        public string TRID { get; set; }
    }

}

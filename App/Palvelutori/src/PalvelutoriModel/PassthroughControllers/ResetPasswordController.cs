using BusinessForms;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PalvelutoriModel.Vetuma;

namespace PalvelutoriModel.PassthroughControllers
{
    public class ResetPasswordController : PassthroughBaseController
    {
        private IVetumaFactory Vetuma { get; }

        public ResetPasswordController(BFContext context, IVetumaFactory vetuma) : base("reset-password", context)
        {
            Vetuma = vetuma;
        }

        [HttpGet]
        public Task<JObject> Create(string contextId = null)
        {
            return Task.FromResult(Serialize(new ResetPasswordMessage
            {
               EMail = "",
               NewPassword = "",
               NewPassword2 = "",
               TRID = ""
            }));
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] ResetPasswordMessage body)
        {
            if (body == null)
            {
                throw new ArgumentException("Invalid user");
            }

            if (string.IsNullOrEmpty(body.EMail))
            {
                ModelState.AddModelError("email", "Tieto on pakollinen.");
            }
            else
            {
                if (!IsValidEmail(body.EMail))
                {
                    ModelState.AddModelError("email", "Tarkista sähköpostiosoite.");
                }
            }

            if (string.IsNullOrEmpty(body.NewPassword))
            {
                ModelState.AddModelError("new_password", "Tieto on pakollinen.");
            }
            else
            {
                if (body.NewPassword != body.NewPassword2)
                {
                    ModelState.AddModelError("new_password", "Tarkista salasana.");
                }
            }

            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            VetumaAuthenticationResponse vetuma;
            if (!Vetuma.CreatedTRIDsForPasswordRecovery.TryGetValue(body.TRID, out vetuma))
            {
                throw new InvalidOperationException($"Could not find VetumaAuthenticationResponse by using the TRID {body.TRID}");
            }

            var succeed = true;

            var obj = JObject.Parse("{ }");
            obj.Add("email", body.EMail);
            obj.Add("vetuma", Vetuma.GetVetumaTokenForPersonId(vetuma.PersonId));
            obj.Add("new_password", body.NewPassword);
         
            JObject result;
            try
            {
                result = await PostJson("reset-password/", obj);
            }
            catch (DjangoFailedException)
            {
                succeed = false;
            }

            VetumaAuthenticationResponse removed;
            Vetuma.CreatedTRIDsForPasswordRecovery.TryRemove(body.TRID, out removed);

            ResetPasswordReply r = new ResetPasswordReply { Succeed = succeed };
            return Json(r);
        }

        [HttpPost("beginVetumaForPasswordRecovery")]
        public virtual IActionResult BeginVetumaForPasswordRecovery()
        {
            var trid = Guid.NewGuid().ToString().Replace("-", string.Empty);
            trid = trid.Substring(0, 20);
            Vetuma.CreatedTRIDsForPasswordRecovery.TryAdd(trid, null);
            return Json(trid);
        }

        private static bool IsValidEmail(string value)
        {
            var valid = false;
            if (!string.IsNullOrEmpty(value))
            {
                valid = new EmailAddressAttribute().IsValid(value);
            }
            return valid;
        }

        public class ResetPasswordReply
        {
            [JsonProperty("succeed")]
            public bool Succeed { get; set; } 
        }

        public class ResetPasswordMessage
        {
            [JsonProperty("email")]
            public string EMail { get; set; }

            [JsonProperty("new_password")]
            public string NewPassword { get; set; }

            [JsonProperty("new_password2")]
            public string NewPassword2 { get; set; }

            [JsonProperty("trid")]
            public string TRID { get; set; }
        }

    }
}

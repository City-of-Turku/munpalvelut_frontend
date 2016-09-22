using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BusinessForms;
using Microsoft.AspNetCore.Mvc;

namespace PalvelutoriModel.PassthroughControllers
{
    public class ChangePasswordController : PassthroughBaseController
    {
        public ChangePasswordController(BFContext context) : base("users/x/change_password", context)
        {
        }
        
        [HttpGet]
        public Task<JObject> Create(string contextId = null)
        {
            return Task.FromResult(Serialize(new ChangePasswordMessage
            {
                OldPassword = "",
                NewPassword = "",
                NewPassword2 = "",
                UserId = ""
            }));
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] ChangePasswordMessage body)
        {
            if (body == null)
            {
                throw new ArgumentException("Invalid body");
            }

            if (string.IsNullOrEmpty(body.OldPassword))
            {
                ModelState.AddModelError("old_password", "Tieto on pakollinen.");
            }

            if (string.IsNullOrEmpty(body.NewPassword))
            {
                ModelState.AddModelError("new_password", "Tieto on pakollinen.");
            }

            if (string.IsNullOrEmpty(body.NewPassword2))
            {
                ModelState.AddModelError("new_password2", "Tieto on pakollinen.");
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

            var succeed = true;

            var api = "users/" + body.UserId + "/change_password/";

            JObject result;
            JObject obj = Serialize(body);
            try
            {
                result = await PutJson(api, obj);
            }
            catch (DjangoFailedException)
            {
                succeed = false;
            }

            ChangePasswordReply r = new ChangePasswordReply { Succeed = succeed };
            return Json(r);
        }

        public class ChangePasswordReply
        {
            [JsonProperty("succeed")]
            public bool Succeed { get; set; }
        }

        public class ChangePasswordMessage
        {
            [JsonProperty("old_password")]
            public string OldPassword { get; set; }

            [JsonProperty("new_password")]
            public string NewPassword { get; set; }

            [JsonProperty("new_password2")]
            public string NewPassword2 { get; set; }

            [JsonProperty("userId")]
            public string UserId { get; set; }
        }

    }
}

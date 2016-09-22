using BusinessForms.Controllers;
using BusinessForms.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using BusinessForms;

namespace PalvelutoriModel.FSControllers
{

    public class OLD_LoginController: BFCommandController
    {
        public OLD_LoginController(BFContext context):base(context)
        {

        }
        protected override Task<JObject> PerformCreate(string contextId)
        {
            return Task.FromResult(JObject.Parse("{ email: '', password: ''}"));
        }

        protected override Task ValidateCommand(JObject commandParameters)
        {
            var lm = Deserialize<LoginModel>(commandParameters);
            if (lm.Email != "test@citrus.fi" || lm.Password != "Test1234") {
                Context.Invalid("email", "Tarkista sähköposti ja salasana");
                return Task.FromResult(true);
            }
            return base.ValidateCommand(commandParameters);
        }

        protected override Task<JObject> PerformCommand(JObject commandParameters)
        {
            LoginInfo li = new LoginInfo();
            li.Token = "123";
            li.UserName = "Test user";
            return Task.FromResult(Serialize(li));
        }
    }

    internal class LoginModel
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }


    internal class LoginInfo
    {
        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("userName")]
        public string UserName { get; set; }
    }
}

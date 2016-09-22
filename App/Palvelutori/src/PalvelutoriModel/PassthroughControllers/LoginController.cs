using BusinessForms;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.PassthroughControllers
{
    public class LoginController: PassthroughCommandController
    {
        public LoginController(BFContext context): base("login/", context)
        {

        }

        protected override Task<JObject> PerformCreate(string contextId)
        {
            return Task.FromResult(JObject.Parse("{ email: '', password: ''}"));
        }
    }
}

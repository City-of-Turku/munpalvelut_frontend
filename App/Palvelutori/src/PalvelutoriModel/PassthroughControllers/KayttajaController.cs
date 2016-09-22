using BusinessForms;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PalvelutoriModel.PassthroughControllers
{
    public class KayttajaController: PassthroughCRUDController
    {
        public KayttajaController(BFContext context):base("users/", context)
        {

        }

        protected override Task<JObject> PerformCreate(string parentId)
        {
            return Task.FromResult(
                JObject.Parse("{ tunnus: '', salasana: '', etunimi: '', sukunimi: ''}")
                );
        }

        public override async Task<IActionResult> Get(string id)
        {
            if (id == null || id == "null" || id == "undefined") {
                return new UnauthorizedResult();
            }
            return await base.Get(id);
        }
    }
}

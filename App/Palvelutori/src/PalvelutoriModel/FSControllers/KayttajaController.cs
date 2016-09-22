using BusinessForms.FSControllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using BusinessForms;

namespace PalvelutoriModel.FSControllers
{
    public class OLD_KayttajaController: FSCRUDController
    {
        public OLD_KayttajaController(BFContext context, IFSProvider fsProvider):
            base(context, fsProvider, "Kayttaja")
        {

        }

        protected override Task<JObject> PerformCreate(string parentId)
        {
            return Task.FromResult(
                JObject.Parse("{ tunnus: '', salasana: '', etunimi: '', sukunimi: ''}")
                );
        }
    }
}

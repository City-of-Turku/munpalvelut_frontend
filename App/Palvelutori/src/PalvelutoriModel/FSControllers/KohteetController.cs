using BusinessForms.FSControllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using BusinessForms;

namespace PalvelutoriModel.FSControllers
{
    public class OLD_KohteetController: FSQueryController
    {
        public OLD_KohteetController(BFContext context, IFSProvider fsProvider):
            base(context, fsProvider, "Kohde")
        {

        }

        protected override Func<JObject, JObject> BuildFilter(JObject queryParams)
        {
            return jrow => WhereFilter(jrow, "kayttaja_id", this.GetUserID());
        }
    }
}

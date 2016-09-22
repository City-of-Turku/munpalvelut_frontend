using BusinessForms;
using BusinessForms.FSControllers;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PalvelutoriModel;
using BusinessForms.Validations;

namespace PalvelutoriModel.FSControllers
{
    public class OLD_KohdeController: FSCRUDController
    {
        public OLD_KohdeController(BFContext context, IFSProvider fsProvider):
            base(context, fsProvider, "Kohde")
        {

        }

        protected override Task<JObject> PerformCreate(string parentId)
        {
            return Task.FromResult(
                JObject.Parse($"{{ katuosoite1: 'Anna osoite', katuosoite2: '', postinumero: '', neliot: 75.0, kayttaja_id: '{this.GetUserID()}' }}")
                );
        }

        protected override Task Validate(bool isNew, JObject newObject)
        {            
            Context.ValidateMinLength(newObject, "postinumero", 5, "Tarkista postinumeron pituus");
            return base.Validate(isNew, newObject);
        }

    }
}

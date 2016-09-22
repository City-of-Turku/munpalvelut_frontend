using BusinessForms;
using BusinessForms.FSControllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.FSControllers
{
    public class OLD_KayttajatController: FSQueryController
    {
        public OLD_KayttajatController(BFContext context, IFSProvider fsProvider):
            base(context, fsProvider, "Kayttaja")
        {

        }
    }
}

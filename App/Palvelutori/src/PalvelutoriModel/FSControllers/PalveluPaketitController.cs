using BusinessForms;
using BusinessForms.FSControllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PalvelutoriModel.FSControllers
{
    public class OLD_PalveluPaketitController: FSQueryController
    {
        public OLD_PalveluPaketitController(BFContext context, IFSProvider fsProvider):
            base(context, fsProvider, "PalveluPaketti")
        {

        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Translation;
using PalvelutoriModel.Controllers;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PalvelutoriSite.Controllers
{
    public class TestPageController : UIController
    {

        public TestPageController()
        {
        }

        public IActionResult ListTestEntity()
        {
            return UIView("ListTestEntity");
        }

        public IActionResult CreateTestEntity()
        {

            return UIView("CreateTestEntity",false);
        }

       

        public IActionResult EditTestEntity()
        {
            return UIView("CreateTestEntity", true);
        }

    }
}

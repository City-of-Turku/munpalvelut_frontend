using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Controllers;
using PalvelutoriModel.Translation;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PalvelutoriSite.Controllers
{
    public class HomeController : UIController
    {
        public HomeController()
        {

        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return UIView("Index");
        }

        public IActionResult ShowError()
        {
            return UIView("ShowError");
        }
    }
}

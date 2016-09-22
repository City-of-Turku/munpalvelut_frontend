using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Controllers;
using PalvelutoriModel.Translation;

namespace PalvelutoriSite.Controllers
{
    public class AdminController : UIController
    {
        public AdminController() : base()
        {            
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return UIView("Index");
        }

        public IActionResult AdminNavBar()
        {
            return UIView("AdminNavBar");
        }

        public IActionResult AdminHome()
        {
            return UIView("AdminHome");
        }

        public IActionResult AdminResourceCalendar()
        {
            return UIView("AdminResourceCalendar");
        }

        public IActionResult YritystiedotEdit()
        {
            return UIView("YritystiedotEdit");
        }

        
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Controllers;
using PalvelutoriModel.Vetuma;

namespace PalvelutoriSite.Controllers
{
    [Route("Vetuma")]
    public class VetumaController : UIController
    {
        private IVetumaFactory Vetuma { get; set; }

        public VetumaController(IVetumaFactory vetuma)
        {
            Vetuma = vetuma;
        }
       
        [HttpGet("Authenticate")]
        public IActionResult Authenticate([FromQuery] string id)
        {
            if (id == null)
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrEmpty(nameof(id)))
            {
                throw new ArgumentException("blank", nameof(id));
            }

            if (!IsValidVetumaRouteId(id))
            {
                throw new InvalidOperationException("Vetuma route id is not valid.");
            }
          
            var model = Vetuma.CreateAuthenticationRequest(GetTrid(id), GetRequestCulture());
            
            return View("Authenticate", model);
        }

        [HttpPost]
        public IActionResult Callback()
        {
            var response = Vetuma.ParseResponse(Request.Form);
            if (response.Status != VetumaAuthenticationResponse.VetumaAuthenticationStatus.Successful)
            {
                return new RedirectResult("/#/show/register");
            }
            return RedirectToAction("Index", "Home");
        }

        private bool IsValidVetumaRouteId(string id)
        {
            return true;
        }

        private string GetTrid(string id)
        {
            return id;
        }
    }
}

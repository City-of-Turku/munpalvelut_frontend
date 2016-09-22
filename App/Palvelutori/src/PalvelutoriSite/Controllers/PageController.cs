using Microsoft.AspNetCore.Mvc;
using PalvelutoriModel.Controllers;
using PalvelutoriModel.Translation;

namespace PalvelutoriSite.Controllers
{
    public class PageController : UIController
    {

        public PageController()
        {
        }

        public IActionResult ShowLogin()
        {
            return UIView("ShowLogin");
        }

        public IActionResult ShowRegister()
        {
            return UIView("ShowRegister");
        }

        public IActionResult ShowRegister2()
        {
            return UIView("ShowRegister2");
        }

        public IActionResult ShowWelcome()
        {
            return UIView("ShowWelcome");
        }

        public IActionResult ShowFAQ()
        {
            return UIView("ShowFAQ");
        }

        public IActionResult ShowTerms()
        {
            return UIView("ShowTerms");
        }

        public IActionResult ShowTaxation()
        {
            return UIView("ShowTaxation");
        }

        public IActionResult ShowForbidden()
        {
            return UIView("ShowForbidden");
        }

        public IActionResult ShowPerustiedot()
        {
            return UIView("ShowPerustiedot");
        }

        public IActionResult CreateKohde()
        {
            return UIView("CreateKohde");
        }

        public IActionResult EditKohde()
        {
            return UIView("CreateKohde");
        }

        public IActionResult EditKayttaja()
        {
            return UIView("EditKayttaja");
        }

        public IActionResult ProcessPackage()
        {
            return UIView("ProcessPackage");
        }

        public IActionResult ProcessProducer()
        {
            return UIView("ProcessProducer");
        }

        public IActionResult ProcessProducerDetails()
        {
            return UIView("ProcessProducerDetails");
        }

        public IActionResult ProcessConfirm()
        {
            return UIView("ProcessConfirm");
        }

        public IActionResult ProcessSummary()
        {
            return UIView("ProcessSummary");
        }

        public IActionResult ShowOrder()
        {
            return UIView("ShowOrder");
        }

        public IActionResult ShowForgotPassword()
        {
            return UIView("ShowForgotPassword");
        }

        public IActionResult ShowForgotPassword2()
        {
            return UIView("ShowForgotPassword2");
        }

        public IActionResult ShowForgotPassword3Succeed()
        {
            return UIView("ShowForgotPassword3Succeed");
        }

        public IActionResult ShowForgotPassword3Failed()
        {
            return UIView("ShowForgotPassword3Failed");
        }

        public IActionResult ShowChangePassword()
        {
            return UIView("ShowChangePassword");
        }

        public IActionResult ShowChangePassword2Succeed()
        {
            return UIView("ShowChangePassword2Succeed");
        }

        public IActionResult ShowChangePassword2Failed()
        {
            return UIView("ShowChangePassword2Failed");
        }

        public IActionResult ShowSearchResults()
        {
            return UIView("ShowSearchResults");
        }

    }
}

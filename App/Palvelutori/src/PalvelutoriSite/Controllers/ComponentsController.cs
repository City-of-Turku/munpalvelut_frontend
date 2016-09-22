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
    public class ComponentsController :  UIController
    {
        public ComponentsController()
        {
        }

        // GET: /<controller>/
        public IActionResult Home()
        {
            return UIView("Home");
        }

        public IActionResult HomeGeneral()
        {
            return UIView("HomeGeneral");
        }

        public IActionResult HomeServices()
        {
            return UIView("HomeServices");
        }

        public IActionResult HomeServicesService()
        {
            return UIView("HomeServicesService");
        }

        public IActionResult NavBar()
        {
            return UIView("NavBar");
        }

        public IActionResult NavBarTools()
        {
            return UIView("NavBarTools");
        }

        public IActionResult NavBarUser()
        {
            return UIView("NavBarUser");
        }

        public IActionResult Cookies()
        {
            return UIView("Cookies");
        }

        public IActionResult Footer()
        {
            return UIView("Footer");
        }

        public IActionResult CleaningProgress()
        {
            return UIView("CleaningProgress");
        }

        public IActionResult BenefitBanner()
        {
            return UIView("BenefitBanner");
        }
        
        public IActionResult ProcessPackageGeneral()
        {
            return UIView("ProcessPackageGeneral");
        }

        public IActionResult ProcessPackagePackages()
        {
            return UIView("ProcessPackagePackages");
        }

        public IActionResult ProcessPackagePackage()
        {
            return UIView("ProcessPackagePackage");
        }

        public IActionResult ProcessPackageCommingSoon()
        {
            return UIView("ProcessPackageCommingSoon");
        }
        
        public IActionResult ProcessProducerGeneral()
        {
            return UIView("ProcessProducerGeneral");
        }

        public IActionResult ProcessProducerExtras()
        {
            return UIView("ProcessProducerExtras");
        }

        public IActionResult ProcessProducerApartment()
        {
            return UIView("ProcessProducerApartment");
        }

        public IActionResult ProcessProducerResults()
        {
            return UIView("ProcessProducerResults");
        }

        public IActionResult ProcessProducerDetailsGeneral()
        {
            return UIView("ProcessProducerDetailsGeneral");
        }

        public IActionResult ProcessProducerDetailsVideo()
        {
            return UIView("ProcessProducerDetailsVideo");
        }

        public IActionResult ProcessProducerDetailsOrder()
        {
            return UIView("ProcessProducerDetailsOrder");
        }        

        public IActionResult ProcessConfirmGeneral()
        {
            return UIView("ProcessConfirmGeneral");
        }

        public IActionResult ProcessSummaryGeneral()
        {
            return UIView("ProcessSummaryGeneral");
        }

        public IActionResult RegisterGeneral()
        {
            return UIView("RegisterGeneral");
        }

        public IActionResult RegisterStepForBasicData()
        {
            return UIView("RegisterStepForBasicData");
        }

        public IActionResult RegisterStepForVetuma()
        {
            return UIView("RegisterStepForVetuma");
        }

        public IActionResult ProcessProducerZackit() {
            return UIView("ProcessProducerZackit");
        }

        public IActionResult KayttajaTilaukset() {
            return UIView("KayttajaTilaukset");
        }
    }
}

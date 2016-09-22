namespace Palvelutori {
    class BenefitBannerController {
    }

    app.component("ptBenefitBanner", {
        templateUrl:() => getUrl('/Components/BenefitBanner'),
        controller: BenefitBannerController
    });
}
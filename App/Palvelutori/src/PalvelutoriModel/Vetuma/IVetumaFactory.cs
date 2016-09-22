using System.Collections.Concurrent;
using System.Globalization;
using Microsoft.AspNetCore.Http;

namespace PalvelutoriModel.Vetuma
{
    public interface IVetumaFactory
    {

        VetumaAuthenticateRequest CreateAuthenticationRequest(string trid, CultureInfo culture);

        VetumaAuthenticationResponse ParseResponse(IFormCollection form);

        ConcurrentDictionary<string, VetumaAuthenticationResponse> CreatedTRIDsForRegistration { get; }

        ConcurrentDictionary<string, VetumaAuthenticationResponse> CreatedTRIDsForPasswordRecovery { get; }

        string GetVetumaTokenForPersonId(string personId);
    }
}

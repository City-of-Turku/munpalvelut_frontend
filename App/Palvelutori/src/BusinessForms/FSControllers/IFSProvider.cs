using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace BusinessForms.FSControllers
{
    public interface IFSProvider
    {
        /// <summary>
        /// Load content of repository to json array
        /// </summary>
        /// <param name="context">Request context</param>
        /// <param name="repository">Repository name</param>
        /// <returns>Repository content</returns>
        Task<JArray> Load(BFContext context, string repository);

        /// <summary>
        /// Save new array to context. 
        /// </summary>
        /// <remarks>This is test repository with absolytely no concurency control. Overwrites on real use is probable!</remarks>
        /// <param name="context">Request context</param>
        /// <param name="repository">Repository name</param>
        /// <param name="content">Repository content</param>
        Task Save(BFContext context, string repository, JArray content);

        /// <summary>
        /// Build unique ID for new records
        /// </summary>
        /// <returns>Unique ID</returns>
        string MakeID();
    }
}
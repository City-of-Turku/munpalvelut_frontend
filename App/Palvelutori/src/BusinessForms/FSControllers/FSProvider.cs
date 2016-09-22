using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BusinessForms.FSControllers
{
    /// <summary>
    /// Concrete file system provider for IFSProvider
    /// </summary>
    public class FSProvider : IFSProvider
    {
        /// <summary>
        /// Directory for test data
        /// </summary>
        /// <param name="directory"></param>
        public FSProvider(string directory)
        {
            this.Directory = directory;
        }

        /// <summary>
        /// Directory containing file system repositories
        /// </summary>
        public string Directory { get; private set; }

        /// <summary>
        /// Load content of repository to json array
        /// </summary>
        /// <param name="context">Request context</param>
        /// <param name="repository">Repository name</param>
        /// <returns>Repository content</returns>
        public Task<JArray> Load(BFContext context, string repository)
        {
            var file = BuildPath(repository);
            if (File.Exists(file)) {
                return Task.FromResult(JArray.Parse(File.ReadAllText(file)));
            }
            return Task.FromResult(new JArray());
        }

        /// <summary>
        /// Save new array to context. 
        /// </summary>
        /// <remarks>This is test repository with absolytely no concurency control. Overwrites on real use is probable!</remarks>
        /// <param name="context">Request context</param>
        /// <param name="repository">Repository name</param>
        /// <param name="content">Repository content</param>
        public Task Save(BFContext context, string repository, JArray content)
        {
            var file = BuildPath(repository);
            File.WriteAllText(file, content.ToString());
#if DNX451
            return Task.FromResult(false);
#else
            return Task.CompletedTask;
#endif
        }

        /// <summary>
        /// Build unique ID for new records
        /// </summary>
        /// <returns>Unique ID</returns>
        public string MakeID()
        {
            long id = ((DateTime.Now.Ticks / 100000000) << 16) + ((Interlocked.Increment(ref _count) & 0xffff));
            return id.ToString();
        }

        private string BuildPath(string repository)
        {
            return Directory + "\\" + repository + ".json";
        }

        private static int _count = 0;
    }
}

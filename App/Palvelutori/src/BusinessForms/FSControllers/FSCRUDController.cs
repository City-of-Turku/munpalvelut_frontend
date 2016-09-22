using BusinessForms.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using BusinessForms.HttpExceptions;

namespace BusinessForms.FSControllers
{
    public abstract class FSCRUDController: BFCRUDController
    {
        protected FSCRUDController(BFContext context, IFSProvider fsRepository, string repositoryName):base(context)
        {
            this.FSRepository = fsRepository;
            this.RepositoryName = repositoryName;
        }

        /// <summary>
        /// Repository provider
        /// </summary>
        public IFSProvider FSRepository { get; private set; }

        /// <summary>
        /// Repository name
        /// </summary>
        public string RepositoryName { get; private set; }

        protected override async Task<JObject> PerformGet(string id)
        {
            var arr = await FSRepository.Load(Context, RepositoryName);
            var current = arr.FirstOrDefault((dynamic row) => row.id == id) as JObject;
            if (current == null)
                throw new NotFoundException();
            return current;
        }

        protected override async Task<JObject> PerformPost(JObject newObject)
        {
            var arr = await FSRepository.Load(Context, RepositoryName);
            newObject.Add("id", FSRepository.MakeID());
            arr.Add(newObject);
            await FSRepository.Save(Context, RepositoryName, arr);
            return newObject;
        }


        protected override async Task<JObject> PerformPut(string id, JObject newObject)
        {
            await Validate(false, newObject);
            if (!Context.IsValid)
                return null;
            var arr = await FSRepository.Load(Context, RepositoryName);
            var current = arr.FirstOrDefault((dynamic row) => row.id == id) as JObject;
            if (current != null) {
                current.Merge(newObject);
                await FSRepository.Save(Context, RepositoryName, arr);
                return current;
            }
            throw new NotFoundException();
        }
    }
}

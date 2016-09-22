using BusinessForms.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace BusinessForms.FSControllers
{
    public class FSQueryController: BFQueryController
    {
        protected FSQueryController(BFContext context, IFSProvider fsRepository, string repositoryName):base(context)
        {
            this.FSRepository = fsRepository;
            this.RepositoryName = repositoryName;
        }

        protected override async Task<JArray> PerformQuery(JObject queryParams)
        {
            var rows = await FSRepository.Load(Context, RepositoryName);
            var filter = BuildFilter(queryParams);
            JArray result = new JArray();
            foreach (JObject row in rows) {
                var jresult = filter(row);
                if (jresult != null) { 
                    result.Add(jresult);
                }
            }
            return result;
        }

        /// <summary>
        /// Build filter based on query parameters. If filter returns null, row will be skipped
        /// </summary>
        /// <param name="queryParams">Query pamaters</param>
        /// <returns>Filter to map row -> returned row. Returning null will skip row</returns>
        protected virtual Func<JObject,JObject> BuildFilter(JObject queryParams)
        {
            return jobj => jobj;
        }

        /// <summary>
        /// Helper to filter row based on column value
        /// </summary>
        /// <param name="row">Row to check</param>
        /// <param name="column">Column</param>
        /// <param name="value">Value for columns</param>
        /// <returns>Only return rows with column mathing value</returns>
        protected JObject WhereFilter(JObject row, string column, string value)
        {
            if (row == null)
                return null;
            var jv = row[column] as JValue;
            if (jv == null)
                return null;
            if (jv.ToString() != value)
                return null;
            return row;
        }

        public IFSProvider FSRepository { get; private set; }

        public string RepositoryName { get; private set; }
    }
}

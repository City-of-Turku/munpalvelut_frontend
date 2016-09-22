using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using BusinessForms;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PalvelutoriModel.Caching;
using PalvelutoriModel.Calendar;
using PalvelutoriModel.PassthroughControllers;

namespace PalvelutoriModel.Search
{
    public class SearchController : PassthroughBaseController
    {
        private static readonly CultureInfo Culture = new CultureInfo("fi-FI");

        private DjangoCache Cache { get; }

        public SearchController(BFContext context, DjangoCache cache) : base("search/", context)
        {
            Cache = cache;
        }

        [HttpPost]
        public async Task<IActionResult> Search([FromBody] SearchData searchData)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            var dt = ToDate(searchData.Paiva);
            if (!dt.HasValue)
            {
                ModelState.AddModelError("Paiva", "Virheellinen päivämäärän muoto");
            }
            else if (dt.Value < DateTime.UtcNow.Date)
            {
                ModelState.AddModelError("Paiva", "Päivä historiassa");
            }
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            var cal = await GetDjangoCalendar(dt.Value);

            var results = new List<CompanySearch>();

            var companies = (await GetCompanies()).ToArray();

            foreach (var company in companies)
            {
                if (Match(company, searchData))
                {
                    var cs = new CompanySearch();
                    cs.Company = company;
                    cs.Suitability = CalcSuitablity(cs.Company, cal, searchData);
                    if (cs.Suitability > 0)
                    {
                        results.Add(cs);
                    }
                }
            }

            return Json(results);
        }

        /// <summary>
        /// Helper metodi order listoille
        /// </summary>
        /// <returns></returns>
        [HttpGet("companies")]
        public Task<IEnumerable<Company>> FindCompanies()
        {
            return GetCompanies();
        }

        /// <summary>
        /// Helper metodi order listoille
        /// </summary>
        /// <returns></returns>
        [HttpGet("company/{id}")]
        public async Task<Company> GetCompany(string id)
        {
            var companies = await GetCompanies();
            return companies.FirstOrDefault(row => row.ID == id);
        }

        private double CalcSuitablity(Company company, List<DjangoTimeEntry> cal, SearchData searchData)
        {
            double sum = 0;
            // return 1.0;     // LK: Temporary fix until we get data
            foreach (var ce in cal.Where(row => row.CompanyID == company.ID))
            {
                int alkuAika = ce.Start.Hour * 60 + ce.Start.Minute;
                int loppuAika = ce.End.Hour * 60 + ce.End.Minute;
                if (alkuAika > searchData.Aika.To || loppuAika < searchData.Aika.From)
                {
                    continue;
                }
                if (alkuAika < searchData.Aika.From)
                {
                    alkuAika = searchData.Aika.From;
                }
                if (loppuAika > searchData.Aika.To)
                {
                    loppuAika = searchData.Aika.To;
                }
                sum += 1.0 * (loppuAika - alkuAika) / (searchData.Aika.To - searchData.Aika.From);
            }
            return sum;
        }

        public static DateTime? ToDate(string paiva)
        {
            DateTime dt;
            if (DateTime.TryParseExact(paiva, "dd.MM.yyyy", Culture, DateTimeStyles.AllowLeadingWhite | DateTimeStyles.AllowLeadingWhite, out dt))
            {
                return dt;
            }
            return null;
        }

        private bool Match(Company cmp, SearchData searchData)
        {
            if (!cmp.OfferedServices.Contains(searchData.Paketti.ID))
                return false;
            return true;
        }

        private async Task<IEnumerable<Company>> GetCompanies()
        {
            IEnumerable<Company> items;

            if (Cache.TryGetCompanies(out items))
            {
                return items;
            }

            var jobject = await GetJson("companies?limit=100000");
            items = Deserialize<List<Company>>(jobject["results"]);
            if (items.Any())
            {
                Cache.SetCompanies(items);
            }
            return items;
        }

        private async Task<List<DjangoTimeEntry>> GetDjangoCalendar(DateTime day)
        {
            Dictionary<long, List<DjangoTimeEntry>> dayEntries = Cache.GetOrCreateDayEntries();

            int key = day.Year * 10000 + day.Month * 100 + day.Day;
            List<DjangoTimeEntry> entries;

            lock (dayEntries)
            {
                if (dayEntries.TryGetValue(key, out entries))
                {
                    return entries;
                }
            }

            var startTime = ToUTC(day, 0);
            var endTime = ToUTC(day.AddDays(1.0), 0);
            var djangoEntries = await GetJson($"calendarentries?&start__gt={startTime}&end__lt={endTime}&limit=100000");
            var dc = Deserialize<DjangoCalendar>(djangoEntries);
            entries = dc.Results;

            lock (dayEntries)
            {
                if (dayEntries.ContainsKey(key))
                {
                    dayEntries[key] = entries;
                }
                else
                {
                    dayEntries.Add(key, entries);
                }
            }

            return entries;
        }

        public static string ToUTC(DateTime dt, int from)
        {
            return String.Format("{0:0000}-{1:00}-{2:00}T{3:00}:{4:00}:00Z", dt.Year, dt.Month, dt.Day, from / 60, from % 60);
        }
    }

    public class CompanySearch
    {
        [JsonProperty("company")]
        public Company Company { get; set; }

        [JsonProperty("suitability")]
        public double Suitability { get; set; }
    }
}

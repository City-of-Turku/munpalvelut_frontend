using System;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;
using PalvelutoriModel.Calendar;
using PalvelutoriModel.Search;

namespace PalvelutoriModel.Caching
{
    public sealed class DjangoCache
    {
        private readonly object _dayEntryLock = new object();

        private const string CacheKeyForCompanies = "DjangoCache.Companies";
        private const string CacheKeyForDayEntries = "DjangoCache.DayEntries";

        private IMemoryCache MemoryCache { get; }

        public DjangoCache(IMemoryCache memoryCache)
        {
            MemoryCache = memoryCache;
        }

        public void SetCompanies(IEnumerable<Company> items)
        {
            if (items == null)
            {
                throw new ArgumentNullException(nameof(items));
            }
            MemoryCache.Set(CacheKeyForCompanies, items, TimeSpan.FromMinutes(60));
        }

        public bool TryGetCompanies(out IEnumerable<Company> items)
        {
            if (MemoryCache.TryGetValue(CacheKeyForCompanies, out items))
            {
                return true;
            }           
            return false;
        }

        public void ClearCompanies()
        {
            MemoryCache.Remove(CacheKeyForCompanies);
        }

        public void SetDayEntries(Dictionary<long, List<DjangoTimeEntry>> items)
        {
            lock (_dayEntryLock)
            {
                if (items == null)
                {
                    throw new ArgumentNullException(nameof(items));
                }
                MemoryCache.Set(CacheKeyForDayEntries, items, TimeSpan.FromMinutes(60));
            }
        }

        public bool TryGetDayEntries(out Dictionary<long, List<DjangoTimeEntry>> items)
        {
            lock (_dayEntryLock)
            {
                if (MemoryCache.TryGetValue(CacheKeyForDayEntries, out items))
                {
                    return true;
                }
                return false;
            }
        }

        public Dictionary<long, List<DjangoTimeEntry>> GetOrCreateDayEntries()
        {
            lock (_dayEntryLock)
            {
                Dictionary<long, List<DjangoTimeEntry>> items;
                if (TryGetDayEntries(out items))
                {
                    return items;
                }
                SetDayEntries(items = new Dictionary<long, List<DjangoTimeEntry>>());
                return items;
            }
        }

        public void ClearDayEntries()
        {
            lock (_dayEntryLock)
            {
                MemoryCache.Remove(CacheKeyForDayEntries);
            }
        }

        public void ClearAll()
        {
            ClearCompanies();
            ClearDayEntries();
        }
    }
}

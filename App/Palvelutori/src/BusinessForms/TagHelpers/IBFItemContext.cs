using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    public interface IBFItemContext
    {
        /// <summary>
        /// SCOPE variable containing BFDataItem. Default to $ctrl.item
        /// </summary>
        string Item { get; }
    }

    
}

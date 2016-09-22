using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.TagHelpers
{
    /// <summary>
    /// Exception throw when tag helpers are not in proper child / parent order
    /// </summary>
    public class SequenceException: Exception
    {
        /// <summary>
        /// Contruct new exception
        /// </summary>
        /// <param name="msg">Message</param>
        public SequenceException(string msg):base(msg)
        {

        }
    }
}

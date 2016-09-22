using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessForms.HttpExceptions
{
    public class UnauthorizedException: BFHttpException
    {
        public override int HttpStatus
        {
            get
            {
                return 403;
            }
        }
    }
}

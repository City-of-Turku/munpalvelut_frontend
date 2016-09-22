using System;

namespace BusinessForms.HttpExceptions
{
    public class BFHttpException : Exception
    {
        public virtual int HttpStatus
        {
            get
            {
                return 400;
            }
        }
    }
}
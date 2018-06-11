using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using WebShop.Contracts;

namespace WebShop.Controllers
{
    [Route("productImageApi")]
    public class ProductImageController : Controller
    {

        [HttpPost("upload")]
        public async Task<object> ImageUpload(int productId, List<IFormFile> files, CancellationToken cancellationToken)
        {

            if (files.Count >= 1)
            {
                var filePath = Path.Combine(Program.UploadFolder, productId.ToString() + ".jpg");
                var formFile = files[0];
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(stream);
                }

                return new SuccessDto
                {
                    Success = true
                };
            }

            return new SuccessDto
            {
                Success = false
            };
        }

    }
}

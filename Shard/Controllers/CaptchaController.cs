using Microsoft.AspNetCore.Mvc;

namespace Shard.Controllers
{
    public class CaptchaController : Controller
    {
        [HttpGet("/funny-captcha")]
        public IActionResult GetCaptcha()
        {
            // This looks for Views/Home/CaptchaIframe.cshtml 
            // (or Views/Shared/CaptchaIframe.cshtml)
            return View("~/Views/CaptchaIframe.cshtml");
        }
    }
}

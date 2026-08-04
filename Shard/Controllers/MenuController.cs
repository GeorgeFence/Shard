using Microsoft.AspNetCore.Mvc;

namespace Shard.Controllers
{
    public class MenuController : Controller
    {
        [HttpGet("/menu")]
        public IActionResult GetMenu()
        {
            return View("~/Views/_Menu.cshtml");
        }
    }
}

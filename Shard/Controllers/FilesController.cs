using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shard.Data;

namespace Shard.Controllers;

[Authorize]
public class FilesController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWebHostEnvironment _environment;

    private readonly string _storageRoot;


    public FilesController(
        UserManager<ApplicationUser> userManager,
        IWebHostEnvironment environment)
    {
        _userManager = userManager;
        _environment = environment;

        _storageRoot = Path.Combine(
            _environment.ContentRootPath,
            "UserFiles"
        );
    }
    [HttpGet("/explorer")]
    public async Task<IActionResult> GetExplorer()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
            return Unauthorized();


        var userPath = Path.Combine(
            _environment.ContentRootPath,
            "UserFiles",
            user.Id
        );


        // vytvoření workspace pokud ještě neexistuje
        Directory.CreateDirectory(userPath);


        var files = Directory.GetFiles(userPath)
            .Select(Path.GetFileName)
            .Where(x => x != null)
            .ToList();


        var folders = Directory.GetDirectories(userPath)
            .Select(Path.GetFileName)
            .Where(x => x != null)
            .ToList();


        ViewBag.Files = files;
        ViewBag.Folders = folders;


        return View("~/Views/_FileExplorer.cshtml");
    }
    private async Task<string> GetUserFolder()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
            throw new UnauthorizedAccessException();


        var folder = Path.Combine(
            _storageRoot,
            user.Id
        );


        Directory.CreateDirectory(folder);


        return folder;
    }



    private static bool IsSafePath(string root, string path)
    {
        var fullRoot = Path.GetFullPath(root);
        var fullPath = Path.GetFullPath(path);


        return fullPath.StartsWith(
            fullRoot,
            StringComparison.OrdinalIgnoreCase
        );
    }



    [HttpGet]
    public async Task<IActionResult> Index(string? path)
    {
        var userFolder = await GetUserFolder();


        var currentPath = userFolder;


        if (!string.IsNullOrWhiteSpace(path))
        {
            // zákaz absolutních cest
            if (Path.IsPathFullyQualified(path))
                return BadRequest();


            currentPath = Path.Combine(
                userFolder,
                path
            );
        }


        if (!IsSafePath(userFolder, currentPath))
            return Forbid();


        if (!Directory.Exists(currentPath))
            return NotFound();



        var files = Directory.GetFiles(currentPath)
            .Select(Path.GetFileName)
            .ToList();


        var folders = Directory.GetDirectories(currentPath)
            .Select(Path.GetFileName)
            .ToList();



        return Json(new
        {
            path,
            folders,
            files
        });
    }



    [HttpGet]
    public async Task<IActionResult> Open(string path)
    {
        var userFolder = await GetUserFolder();


        if (string.IsNullOrWhiteSpace(path))
            return BadRequest();


        var filePath = Path.Combine(
            userFolder,
            path
        );


        if (!IsSafePath(userFolder, filePath))
            return Forbid();



        if (!System.IO.File.Exists(filePath))
            return NotFound();



        var content = await System.IO.File.ReadAllTextAsync(filePath);


        return Ok(new
        {
            path,
            content
        });
    }




    [HttpPost]
    public async Task<IActionResult> Save(
        string path,
        [FromBody] string content)
    {
        var userFolder = await GetUserFolder();


        if (string.IsNullOrWhiteSpace(path))
            return BadRequest();



        var filePath = Path.Combine(
            userFolder,
            path
        );


        if (!IsSafePath(userFolder, filePath))
            return Forbid();



        var directory = Path.GetDirectoryName(filePath);


        if (directory != null)
            Directory.CreateDirectory(directory);



        await System.IO.File.WriteAllTextAsync(
            filePath,
            content
        );


        return Ok();
    }
}
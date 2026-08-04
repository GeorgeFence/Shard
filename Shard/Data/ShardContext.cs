using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ShardContext(DbContextOptions<ShardContext> options) : IdentityDbContext<Shard.Data.ApplicationUser>(options)
{
}

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data
{
    // We inherit from IdentityDbContext<AppUser> instead of DbContext.
    // This automatically creates all the Identity tables (Users, Roles, Claims, etc.)
    // in addition to our custom tables.
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        // Constructor passes options (like connection string) to the base DbContext.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        // DbSet represents the table in the database
        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
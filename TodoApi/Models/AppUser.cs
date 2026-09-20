using Microsoft.AspNetCore.Identity;

namespace TodoApi.Models
{
    // ApiUser inherits from IdentityUser.
    // This gives us built-in properties like Id, UserName, Email, PasswordHash, etc.
    // We extend it here in case we want to add custom properties later (Like FirstName, LastName).
    public class AppUser : IdentityUser
    {
        
    }
}
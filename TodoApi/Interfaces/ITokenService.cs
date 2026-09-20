using TodoApi.Models;

namespace TodoApi.Interfaces
{
    // Interface for our token service
    // This follows Dependency Injection Principle (DIP).
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
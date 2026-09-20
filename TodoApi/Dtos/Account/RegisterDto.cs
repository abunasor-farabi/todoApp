using System.ComponentModel.DataAnnotations;

namespace TodoApi.Dtos.Account
{
    // Data the client sends when registering.
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress] // Validates that the striung is a proper email format.
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
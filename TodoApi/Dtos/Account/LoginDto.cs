using System.ComponentModel.DataAnnotations;

namespace TodoApi.Dtos.Account
{
    // Data the client sends when logging in.
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
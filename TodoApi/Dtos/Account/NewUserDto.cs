namespace TodoApi.Dtos.Account
{
    // Data the API sends back to the client after successful login/register.
    public class NewUserDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;   // The JWT!
    }
}
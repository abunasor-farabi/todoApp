using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Interfaces;
using TodoApi.Models;

namespace TodoApi.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        // Inject IConfiguration to read appsettings.json (JWT keys)
        public TokenService(IConfiguration config)
        {
            _config = config;
            // Create a symmetric key using the secret from appsettings.json.
            // Symmetric means the same key used to sign and verify the token.
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
        }

        public string CreateToken(AppUser user)
        {
            //  1. Create Cleaims (Information about the user embedded in the token)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.UserName),
                // CRITICAL: We add the UserId as a claim. This is how our TodoController
                // will know who is making the request.
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            // 2. Create Signing Credentials (Algorithm + Key)
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            // 3. Describe the Token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1), // Token expires in 1 day
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            // 4. Generate the Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // 5. Return the string representation of the token
            return tokenHandler.WriteToken(token);
        }
    }
}
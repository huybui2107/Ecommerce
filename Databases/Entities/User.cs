using Microsoft.AspNetCore.Identity;

namespace BE.Databases.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; } = null!;
    }
}

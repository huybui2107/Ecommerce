namespace BE.Databases.Entities
{
    public class Address
    {
        public string FullName { get; set; } = null!;
        public string Address1 { get; set; } = null!;
        public string Address2 { get; set; } = null!;

        public string City { get; set; } = null!;

        public string State { get; set; } = null!;
        public string Zip { get; set; } = null!;
        public string Country { get; set; } = null!;
    }
}

using Microsoft.EntityFrameworkCore;

namespace BE.Databases.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = null!;

        public string PictureUrl { get; set; } = null!;
    }
}

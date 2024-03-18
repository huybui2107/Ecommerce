using BE.Databases.Entities.OrderAggregate;

namespace BE.DTOs
{
    public class OrderItemDto
    {
        public int productId { get; set; }

        public string Name { get; set; } = null!;
        public string PictureUrl { get; set; } = null!;
        public long Price { get; set; }
        public int Quantity { get; set; }

    }
}

using BE.Databases.Entities.OrderAggregate;

namespace BE.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = null!;
        public ShippingAddress ShippingAddress { get; set; } = null!;
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public List<OrderItemDto> Items { get; set; } = null!;

        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public string Status { get; set; } = null!;

        public long Total { get; set; }
    }
}

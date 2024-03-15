namespace BE.Databases.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = null!;
        public ShippingAddress ShippingAddress { get; set; } = null!;
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public List<OrderItem> Items { get; set; } = null!;

        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public long GetTotal()
        {
            return Subtotal + DeliveryFee;
        }
    }
}

using BE.Databases.Entities.OrderAggregate;
using BE.DTOs;
using System.Runtime.CompilerServices;

namespace BE.Extensions
{
    public static class OrderExtension
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query
                .Select(order => new OrderDto
                {
                    Id = order.Id,
                    BuyerId = order.BuyerId,
                    OrderDate = order.OrderDate,
                    ShippingAddress = order.ShippingAddress,
                    DeliveryFee = order.DeliveryFee,
                    Subtotal = order.Subtotal,
                    Status = order.Status.ToString(),
                    Total = order.GetTotal(),
                    Items = order.Items.Select(item => new OrderItemDto
                    {
                        productId = item.ItemOrdered.ProductId,
                        Name = item.ItemOrdered.Name,
                        PictureUrl = item.ItemOrdered.PictureUrl,
                        Price = item.Price,
                        Quantity = item.Quantity,
                    }).ToList()
                });
        }
    }
}

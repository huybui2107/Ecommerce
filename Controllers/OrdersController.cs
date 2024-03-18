﻿using BE.Databases;
using BE.Databases.Entities;
using BE.Databases.Entities.OrderAggregate;
using BE.DTOs;
using BE.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly DataContext _context;

        public OrdersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            /*return await _context.orders
                .Include(o => o.Items)
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();*/
            return await _context.orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            //var order = await _context.orders
            //    .Include(o => o.Items)
            //    .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
            //    .FirstOrDefaultAsync();

            var order = await _context.orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
            if (order is null) return NotFound("No have any order");
            return Ok(order);
        }
        [HttpPost]

        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {

            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();
            Console.WriteLine("te st" + User.Identity);
            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl,
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            var order = new Order
            {
                Items = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee,
            };
            _context.orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                user.Address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country,
                };
                _context.Update(user);

            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

            return BadRequest("Problem creating order");
        }
    }
}

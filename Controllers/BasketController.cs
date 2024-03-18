using BE.Databases;
using BE.Databases.Entities;
using BE.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly DataContext _context;

        public BasketController(DataContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await _context.Baskets
                             .Include(i => i.Items)
                             .ThenInclude(item => item.Product)
                                      .FirstOrDefaultAsync(u => u.BuyerId == Request.Cookies["buyerId"]);

            if (basket == null) { return NotFound("basket not found"); }
            return MapBasketDto(basket);

        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await _context.Baskets
                             .Include(i => i.Items)
                             .ThenInclude(item => item.Product)
                             .FirstOrDefaultAsync(u => u.BuyerId == Request.Cookies["buyerId"]);

            if (basket == null) basket = CreateBasket();

            var product = await _context.Products.FindAsync(productId);

            if (product == null) { return NotFound(); }

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket", MapBasketDto(basket));

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {

            var basket = await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(u => u.BuyerId == Request.Cookies["buyerId"]);

            if (basket == null) return NotFound("Basket not found");

            basket.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item" });
        }
        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId))
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = false,
                    IsEssential = true,
                    Expires = DateTime.Now.AddDays(30),
                    Secure = true, // Nếu sử dụng HTTPS
                    SameSite = SameSiteMode.None
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);

            return basket;
        }
        public static BasketDto MapBasketDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList(),
            };
        }
    }
}

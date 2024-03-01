using BE.Databases.Entities;

namespace BE.DTOs
{
    public class BasketDto
    {
      public int Id { get; set; }
        public string BuyerId { get; set; } = null!;

        public List<BasketItemDto> Items { get; set; } 
    }
}

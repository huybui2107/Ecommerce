﻿namespace BE.DTOs
{
    public class BasketItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = null!;
        public long Price { get; set; }

        public string PictureUrl { get; set; } = null!; 
        public string Brand { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
namespace BE.Databases.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } = null!;

        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quanlity)
        {
            if  (Items.All(item => item.ProductId != product.Id)) {
                Items.Add(new BasketItem { Product = product, Quantity = quanlity });
            }
            var existItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existItem != null) existItem.Quantity += quanlity;
        }
        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity == 0) Items.Remove(item);
        }
    }
}

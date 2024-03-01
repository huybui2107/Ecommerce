using BE.Databases.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Databases
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options): base(options)
        { 

        }
        public DbSet<Product> Products {  get; set; }
        public DbSet<Basket> Baskets { get; set; }
       
    }
}

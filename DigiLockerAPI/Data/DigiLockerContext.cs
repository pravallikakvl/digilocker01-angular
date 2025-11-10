using Microsoft.EntityFrameworkCore;
using DigiLockerAPI.Models;

namespace DigiLockerAPI.Data
{
    public class DigiLockerContext : DbContext
    {
        public DigiLockerContext(DbContextOptions<DigiLockerContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table name to match your database
            modelBuilder.Entity<User>().ToTable("users");
            
            // Configure column names to match your actual table structure
            modelBuilder.Entity<User>().Property(e => e.Id).HasColumnName("id");
            modelBuilder.Entity<User>().Property(e => e.Email).HasColumnName("email");
            modelBuilder.Entity<User>().Property(e => e.FirstName).HasColumnName("first_name");
            modelBuilder.Entity<User>().Property(e => e.LastName).HasColumnName("last_name");
            modelBuilder.Entity<User>().Property(e => e.MobileNumber).HasColumnName("mobile_number");
            modelBuilder.Entity<User>().Property(e => e.DateOfBirth).HasColumnName("dob");
            modelBuilder.Entity<User>().Property(e => e.Gender).HasColumnName("gender");
            modelBuilder.Entity<User>().Property(e => e.StudentId).HasColumnName("student_id");
            modelBuilder.Entity<User>().Property(e => e.UserId).HasColumnName("user_id");
            modelBuilder.Entity<User>().Property(e => e.CreatedAt).HasColumnName("created_on");
            
            // Note: Your table doesn't have role, is_active, or updated_on columns
            // We'll need to handle these differently or add them to your table
            modelBuilder.Entity<User>().Ignore(e => e.Role);
            modelBuilder.Entity<User>().Ignore(e => e.IsActive);
        }
    }
}
using System.ComponentModel.DataAnnotations;

namespace DigiLockerAPI.Models
{
    public class User
    {
        public long Id { get; set; } // Changed to long to match bigint
        
        [Required]
        public string UserId { get; set; } = string.Empty; // Unique user identifier
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        public string MobileNumber { get; set; } = string.Empty;
        
        public DateTime? DateOfBirth { get; set; } // Maps to 'dob' column
        
        public string Gender { get; set; } = string.Empty; // "Male", "Female", "Other"
        
        public string StudentId { get; set; } = string.Empty; // Only for students
        
        public DateTime? CreatedAt { get; set; } // Maps to 'created_on' column
        
        // Properties not in database but needed for application logic
        [Required]
        public string Role { get; set; } = string.Empty; // "student" or "institute" - not stored in DB
        
        public bool IsActive { get; set; } = true; // Not stored in DB, always true
        
        // Computed property for full name
        public string FullName => $"{FirstName} {LastName}";
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public User? User { get; set; }
    }

    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = string.Empty;
        
        [Phone]
        public string MobileNumber { get; set; } = string.Empty;
        
        public DateTime? DateOfBirth { get; set; }
        
        public string Gender { get; set; } = string.Empty;
        
        public string StudentId { get; set; } = string.Empty; // Only for students
        
        public string UserId { get; set; } = string.Empty;
    }
}
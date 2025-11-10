using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DigiLockerAPI.Data;
using DigiLockerAPI.Models;

namespace DigiLockerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DigiLockerContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(DigiLockerContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation($"Login attempt for email: {request.Email}, role: {request.Role}");

                User? user = null;

                try
                {
                    // Try to find user in database
                    user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == request.Email && u.Role == request.Role && u.IsActive);
                }
                catch (Exception dbEx)
                {
                    _logger.LogWarning(dbEx, "Database not available, using demo users");
                    
                    // Fallback to demo users if database is not available
                    if (request.Email == "rahul@student.edu" && request.Role == "student")
                    {
                        user = new User
                        {
                            Id = 1,
                            Email = "rahul@student.edu",
                            FirstName = "Rahul",
                            LastName = "Kumar",
                            Role = "student",
                            MobileNumber = "9876543210",
                            DateOfBirth = new DateTime(2000, 5, 15),
                            Gender = "Male",
                            StudentId = "STU001",
                            UserId = "STUDENT20241101001",
                            CreatedAt = DateTime.UtcNow,
                            IsActive = true
                        };
                    }
                    else if (request.Email == "admin@delhiuniversity.edu" && request.Role == "institute")
                    {
                        user = new User
                        {
                            Id = 2,
                            Email = "admin@delhiuniversity.edu",
                            FirstName = "Delhi",
                            LastName = "University",
                            Role = "institute",
                            MobileNumber = "9876543211",
                            Gender = "Other",
                            UserId = "INSTITUTE20241101001",
                            CreatedAt = DateTime.UtcNow,
                            IsActive = true
                        };
                    }
                }

                if (user == null)
                {
                    _logger.LogWarning($"User not found: {request.Email}");
                    return Ok(new LoginResponse 
                    { 
                        Success = false, 
                        Message = "Invalid credentials" 
                    });
                }

                // For demo purposes, accept any password
                // In production, you would hash and verify the password
                _logger.LogInformation($"Login successful for user: {user.Email}");

                return Ok(new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    User = user
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return Ok(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Internal server error: " + ex.Message
                });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                _logger.LogInformation($"Registration attempt for email: {request.Email}");

                try
                {
                    // Check if user already exists
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == request.Email);

                    if (existingUser != null)
                    {
                        return Ok(new LoginResponse 
                        { 
                            Success = false, 
                            Message = "User already exists" 
                        });
                    }

                    // Generate unique UserId if not provided
                    var userId = !string.IsNullOrEmpty(request.UserId) ? request.UserId : 
                        $"{request.Role.ToUpper()}{DateTime.UtcNow:yyyyMMddHHmmss}";

                    // Create new user
                    var newUser = new User
                    {
                        Email = request.Email,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        Role = request.Role,
                        MobileNumber = request.MobileNumber,
                        DateOfBirth = request.DateOfBirth,
                        Gender = request.Gender,
                        StudentId = request.Role == "student" ? request.StudentId : string.Empty,
                        UserId = userId,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    };

                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation($"User registered successfully in database: {newUser.Email}");

                    return Ok(new LoginResponse
                    {
                        Success = true,
                        Message = "Registration successful",
                        User = newUser
                    });
                }
                catch (Exception dbEx)
                {
                    _logger.LogWarning(dbEx, "Database not available, registration in memory only");
                    
                    // If database is not available, still allow registration (in-memory only)
                    var userId = !string.IsNullOrEmpty(request.UserId) ? request.UserId : 
                        $"{request.Role.ToUpper()}{DateTime.UtcNow:yyyyMMddHHmmss}";

                    var newUser = new User
                    {
                        Id = new Random().Next(1000, 9999),
                        Email = request.Email,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        Role = request.Role,
                        MobileNumber = request.MobileNumber,
                        DateOfBirth = request.DateOfBirth,
                        Gender = request.Gender,
                        StudentId = request.Role == "student" ? request.StudentId : string.Empty,
                        UserId = userId,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    };

                    _logger.LogInformation($"User registered in memory: {newUser.Email}");

                    return Ok(new LoginResponse
                    {
                        Success = true,
                        Message = "Registration successful (demo mode - database not connected)",
                        User = newUser
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return Ok(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Registration error: " + ex.Message
                });
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                // Set IsActive to true for all users since it's not in the database
                users.ForEach(u => u.IsActive = true);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("test-connection")]
        public async Task<ActionResult> TestConnection()
        {
            try
            {
                // Test basic database connectivity
                var canConnect = await _context.Database.CanConnectAsync();
                
                if (!canConnect)
                {
                    return Ok(new { 
                        Success = false, 
                        Message = "Cannot connect to database",
                        ConnectionString = _context.Database.GetConnectionString()
                    });
                }

                // Try to ensure the database and table exist
                await _context.Database.EnsureCreatedAsync();
                
                return Ok(new { 
                    Success = true, 
                    Message = "Database connection successful",
                    ConnectionString = _context.Database.GetConnectionString(),
                    DatabaseExists = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection test failed");
                return Ok(new { 
                    Success = false, 
                    Message = ex.Message,
                    ConnectionString = _context.Database.GetConnectionString()
                });
            }
        }

        [HttpGet("check-table")]
        public async Task<ActionResult> CheckTable()
        {
            try
            {
                // Execute raw SQL to check table structure
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                
                using var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT column_name, data_type, is_nullable 
                    FROM information_schema.columns 
                    WHERE table_name = 'users' 
                    ORDER BY ordinal_position";
                
                var columns = new List<object>();
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    columns.Add(new
                    {
                        ColumnName = reader["column_name"].ToString(),
                        DataType = reader["data_type"].ToString(),
                        IsNullable = reader["is_nullable"].ToString()
                    });
                }
                
                return Ok(new
                {
                    Success = true,
                    TableExists = columns.Count > 0,
                    Columns = columns
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking table structure");
                return Ok(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("database-info")]
        public async Task<ActionResult> GetDatabaseInfo()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var studentsCount = await _context.Users.CountAsync(u => u.StudentId != null && u.StudentId != "");
                var institutesCount = totalUsers - studentsCount;
                
                var recentUsers = await _context.Users
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(5)
                    .Select(u => new { u.Email, u.UserId, u.CreatedAt, u.StudentId })
                    .ToListAsync();

                return Ok(new
                {
                    TotalUsers = totalUsers,
                    StudentsCount = studentsCount,
                    InstitutesCount = institutesCount,
                    RecentUsers = recentUsers,
                    Database = "CockroachDB",
                    LastUpdated = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching database info");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
using Microsoft.EntityFrameworkCore;
using DigiLockerAPI.Models;
using DigiLockerAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://localhost:4201", "http://localhost:4202")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .SetIsOriginAllowed(origin => true) // Allow any origin for development
                  .AllowCredentials();
        });
});

// Add Entity Framework with PostgreSQL (CockroachDB)
builder.Services.AddDbContext<DigiLockerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");

app.UseRouting();
app.MapControllers();

// Database connection will be established when needed
// Make sure your 'users' table exists in kemis_db database

app.Run();

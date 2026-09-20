using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Models
{
    // This is our single entity for CRUD operations.
    public class TodoItem
    {
        // Primary key for the database. EF Core will automatically make this an Auto-Incrementing ID.
        [Key]
        public int Id { get; set; }

        // The name of the task. [Required] ensures the database column is NOT NULL
        [Required]
        public string TaskName { get; set; } = string.Empty;

        // When the task is supposed to start.
        public DateTime StartAt { get; set; }
        
        // When the task supposed to end.
        public DateTime EndAt { get; set; }

        // The checkbok: true if completed, false if not.
        public bool IsCompleted { get; set; }

        // FOREIGN KEY: This links the TodoItem to a specific user.
        // We will use this to ensure users only see THEIR OWN todos.
        public string UserId { get; set; } = string.Empty;

        // NAVIGATION PROPERTY: This allows us to access the User object from the TodoItem in code.
        [ForeignKey("UserId")]
        public AppUser? User { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Dtos.Todo
{
    public class UpdateTodoDto
    {
        [Required]
        public string TaskName { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsCompleted { get; set; }
    }
}
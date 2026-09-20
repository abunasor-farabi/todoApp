using System.ComponentModel.DataAnnotations;

namespace TodoApi.Dtos.Todo
{
    public class CreateTodoDto
    {
        [Required]
        public string TaskName { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}
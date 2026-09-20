namespace TodoApi.Dtos.Todo
{
    public class TodoDto
    {
        public int Id { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsCompleted { get; set; }
    }
}
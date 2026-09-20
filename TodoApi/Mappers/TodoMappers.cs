using TodoApi.Dtos.Todo;
using TodoApi.Models;

namespace TodoApi.Mappers
{
    // Extension methods to easily convert Models <---> DTOs
    public static class TodoMappers
    {
        public static TodoDto ToTodoDto(this TodoItem todoModel)
        {
            return new TodoDto
            {
                Id = todoModel.Id,
                TaskName = todoModel.TaskName,
                StartAt = todoModel.StartAt,
                EndAt = todoModel.EndAt,
                IsCompleted = todoModel.IsCompleted
            };
        }

        public static TodoItem ToTodoFromCreateDto(this CreateTodoDto todoDto, string userId)
        {
            return new TodoItem
            {
                TaskName = todoDto.TaskName,
                StartAt = todoDto.StartAt,
                EndAt = todoDto.EndAt,
                IsCompleted = false, // Default to false for new tasks
                UserId = userId
            };
        }
    }
}
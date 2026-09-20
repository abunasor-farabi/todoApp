using TodoApi.Dtos.Todo;
using TodoApi.Models;

namespace TodoApi.Interfaces
{
    public interface ITodoRepository
    {
        // Notice how every method requires a userId.
        // This ensures a user can NEVER access another user's data.
        Task<List<TodoItem>> GetAllAsync(string userId);
        Task<TodoItem?> GetByIdAsync(int id, string userId);
        Task<TodoItem> CreateAsync(TodoItem todoItem);
        Task<TodoItem?> UpdateAsync(int id, UpdateTodoDto updateDto, string userId);
        Task<TodoItem?> DeleteAsync(int id, string userId);
    }
}
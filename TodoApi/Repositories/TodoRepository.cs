using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Dtos.Todo;
using TodoApi.Interfaces;
using TodoApi.Models;

namespace TodoApi.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private readonly ApplicationDbContext _context;

        // Inject the Database Context
        public TodoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TodoItem> CreateAsync(TodoItem todoItem)
        {
            // Add to database
            await _context.TodoItems.AddAsync(todoItem);
            await _context.SaveChangesAsync();
            return todoItem;
        }

        public async Task<TodoItem?> DeleteAsync(int id, string userId)
        {
            var todoItem = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
            if (todoItem == null) return null;

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();
            return todoItem;
        }

        public async Task<List<TodoItem>> GetAllAsync(string userId)
        {
            // Fetch only the todos that belong to the logged-in user
            return await _context.TodoItems
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async Task<TodoItem?> GetByIdAsync(int id, string userId)
        {
            // Find by Id AND UserId to prevent unauthorized access
            return await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<TodoItem?> UpdateAsync(int id, UpdateTodoDto updateDto, string userId)
        {
            // 1. Find the existing item
            var existingTodo = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
            if (existingTodo == null) return null;

            // 2. Update the fields
            existingTodo.TaskName = updateDto.TaskName;
            existingTodo.StartAt = updateDto.StartAt;
            existingTodo.EndAt = updateDto.EndAt;
            existingTodo.IsCompleted = updateDto.IsCompleted;

            // 3. Save changes
            await _context.SaveChangesAsync();
            return existingTodo;
        }
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Dtos.Todo;
using TodoApi.Interfaces;
using TodoApi.Mappers;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] at the controller level means ALL endpoints here require a valid JWT.
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly ITodoRepository _todoRepo;
        public TodoController(ITodoRepository todoRepo)
        {
            _todoRepo = todoRepo;
        }

        // Helper method to extract the UserId from the JWT Token
        private string GetUserId()
        {
            // We stored the UserId in ClaimTypes.NameIdentifier in TokenService.
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var todos = await _todoRepo.GetAllAsync(userId);

            // Map the database models to DTOs to avoid exposing sensitive data
            var todoDtos = todos.Select(t => t.ToTodoDto()).ToList();

            return Ok(todoDtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var userId = GetUserId();
            var todo = await _todoRepo.GetByIdAsync(id, userId);

            if (todo == null) return NotFound();

            return Ok(todo.ToTodoDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTodoDto createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();

            // Map DTO to Model and attach the logged-in User's ID
            var todoModel = createDto.ToTodoFromCreateDto(userId);

            await _todoRepo.CreateAsync(todoModel);

            return CreatedAtAction(nameof(GetById), new { id = todoModel.Id }, todoModel.ToTodoDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateTodoDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var todoModel = await _todoRepo.UpdateAsync(id, updateDto, userId);

            if (todoModel == null) return NotFound();

            return Ok(todoModel.ToTodoDto());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var userId = GetUserId();
            var todoModel = await _todoRepo.DeleteAsync(id, userId);

            if (todoModel == null) return NotFound();

            return NoContent();
        }
    }
}
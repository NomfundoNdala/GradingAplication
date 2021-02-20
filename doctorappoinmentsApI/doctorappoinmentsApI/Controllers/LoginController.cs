using doctorappoinmentsApI.Helpers;
using doctorappoinmentsApI.Models.Mongo;
using doctorappoinmentsApI.Models.users;
using Microsoft.AspNetCore.Mvc;

namespace doctorappoinmentsApI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IMongoRepository<AccountDetails> _mongoRepositoryAccountDetails;

        public LoginController(IMongoRepository<AccountDetails> mongoRepositoryAccountDetails)
        {
            _mongoRepositoryAccountDetails = mongoRepositoryAccountDetails;
        }

        [HttpPost]
        [Route("createAcount")]

        public IActionResult CreateAccount()
        {
            return Ok();
        }

        [HttpPost]
        [Route("login")]

        public IActionResult Login(string username, string password)
        {

            if (string.IsNullOrEmpty(username))
                return BadRequest(new { status = true, message = "username cannot be null or empty", data = username });
            if (string.IsNullOrEmpty(password))
                return BadRequest(new { status = true, message = "password cannot be null or empty", data = password });

            var user = _mongoRepositoryAccountDetails.FindOneAsync(x =>
                x.Password.Equals(password) && x.Username.Equals(username)).Result;

            if (user != null)
            {
                var jwtDetails = JwtHelper.BuildJwt(user.AccountId, isLecture: user.IsLecture, admin: user.Admin);
                return Ok(new { status = true, message = "Successfull Request", data = new { name = user.Name, surname = user.Surname, stuffNumber = user.Username, jwt = jwtDetails } });
            }
            return Ok(new { status = false, message = "Account does not exist", data = password });
        }

    }
}
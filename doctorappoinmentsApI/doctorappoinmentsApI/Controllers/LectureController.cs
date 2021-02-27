using doctorappoinmentsApI.Helpers;
using doctorappoinmentsApI.Models.Lecturer;
using doctorappoinmentsApI.Models.Marks;
using doctorappoinmentsApI.Models.Mongo;
using doctorappoinmentsApI.Models.Students;
using doctorappoinmentsApI.Models.users;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace doctorappoinmentsApI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LectureController : ControllerBase
    {

        private readonly IMongoRepository<AccountDetails> _mongoRepositoryAccountDetails;
        private readonly IMongoRepository<Lecture> _mogoRepositoryLecture;
        private readonly IMongoRepository<Group> _mongoRepositoryGroup;

        public LectureController(IMongoRepository<AccountDetails> mongoRepositoryAccountDetails, IMongoRepository<Lecture> mongoRepositoryLecture, IMongoRepository<Group> mongoRepositoryGroup)
        {
            _mongoRepositoryAccountDetails = mongoRepositoryAccountDetails;
            _mogoRepositoryLecture = mongoRepositoryLecture;
            _mongoRepositoryGroup = mongoRepositoryGroup;
        }

        [HttpGet]
        [Route("getAll")]
        public IActionResult GetAll()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            var allDoctors = _mogoRepositoryLecture.AsQueryable().ToList();
            return Ok(new { status = true, message = "successful request", data = allDoctors });

        }

        [HttpPost]
        [Route("create")]
        public IActionResult Create([FromBody] LectureDTO newLecture)
        {

            var exixstinDoctor =
                _mongoRepositoryAccountDetails.FindOneAsync(x => x.Username.Equals(newLecture.StuffNumber)).Result;
            if (exixstinDoctor != null)
            {
                return BadRequest(new { status = false, message = "Account already exist", data = "" });
            }
            var lecture = new Lecture()
            {
                AccountId = Guid.NewGuid(),
                StuffNumber = newLecture.StuffNumber,
                Email = newLecture.Email,
                Name = newLecture.Name,
                Password = newLecture.Password,
                Surname = newLecture.Surname
            };
            var account = new AccountDetails()
            {
                AccountId = lecture.AccountId,
                CreateDateTime = DateTime.Now,
                Password = lecture.Password,
                Username = lecture.StuffNumber,
                Name = lecture.Name,
                Surname = lecture.Surname,
                Admin = false,
                IsLecture = true
            };
            _mongoRepositoryAccountDetails.InsertOneAsync(account);
            _mogoRepositoryLecture.InsertOneAsync(lecture);

            return Ok(new { status = true, message = "successful request", data = lecture });
        }

        [HttpGet]
        [Route("getDetails")]
        public IActionResult GetDetails()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            var details = _mogoRepositoryLecture.FindOneAsync(x => x.AccountId.Equals(claims.AccountId));
            if (details == null)
            {
                return BadRequest(new { status = false, message = "account id cannot be null or empty", data = "" });
            }


            return Ok(new { status = true, message = "successful request", data = details });
        }


        [HttpGet]
        [Route("getDetailsOfStudent")]
        public IActionResult GetDetailsOfPatient(string id)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (claims.Admin || claims.IsLecture)
            {
                var patient = _mogoRepositoryLecture.FindOne(x => x.Id.Equals(ObjectId.Parse(id)));

                return Ok(new { status = true, message = "successful request", data = patient });
            }

            return Ok(new { status = false, message = "Request to be performed by a doctor or admin", data = id });
        }

        [HttpDelete]
        [Route("deleteDetails")]
        public IActionResult DeleteDetails(string accountId = null)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (string.IsNullOrEmpty(accountId))
                return BadRequest(new { status = true, message = "account id cannot be null or empty", data = accountId });


            if (claims.IsLecture || claims.Admin)
            {
                if (accountId != null)
                {
                    _mogoRepositoryLecture.DeleteOneAsync(x => x.AccountId.Equals(Guid.Parse(accountId)));
                }
                var details = _mogoRepositoryLecture.DeleteOneAsync(x => x.AccountId.Equals(claims.AccountId));

                return Ok(new { status = true, message = "Deleted", data = details });
            }

            return Ok(new { status = false, message = "Request to be performed by a lecture or admin", data = accountId });
        }

        [HttpPatch]
        [Route("updateDetails")]
        public IActionResult UpdateDetails([FromBody]  LectureDTO newLecture)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (claims.IsLecture || claims.Admin)
            {
                var oldDetails = _mogoRepositoryLecture.FindOne(x => x.AccountId.Equals(claims.AccountId));

                oldDetails.Email = newLecture.Email;
                oldDetails.Name = newLecture.Name;
                oldDetails.Password = newLecture.Password;
                oldDetails.Email = newLecture.Email;
                oldDetails.StuffNumber = newLecture.StuffNumber;
                oldDetails.Surname = newLecture.Surname;
                oldDetails.Password = newLecture.Password;

                _mogoRepositoryLecture.ReplaceOneAsync(oldDetails);
                return Ok(new { status = true, message = "successful request", data = newLecture });
            }

            return Ok(new { status = false, message = "Request to be performed by a lecture or admin ", data = "" });
        }

        [HttpPost]
        [Route("CreateGroup")]

        public async Task<IActionResult> CreateGroup([FromBody] GroupDTO group)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (claims.IsLecture || claims.Admin)
            {
                var oldGroup = _mongoRepositoryGroup.FindOne(x => x.GroupName.ToLower().Equals(group.GroupName.ToLower()));

                if (oldGroup == null)
                {
                    var g = new Group()
                    {
                        GroupId = @group.GroupId,
                        GroupName = @group.GroupName,
                        Assignemts = new Dictionary<string, Marks>()
                            {{"", new Marks() {Mark = 0, Name = "", Weight = 0}}}
                    };
                    await _mongoRepositoryGroup.InsertOneAsync(g);
                    return Ok(new { status = true, message = "successful request", data = @group });
                }
                else
                {
                    return BadRequest(new
                    { status = true, message = $"Group name {@group.GroupName} already exist", data = @group });
                }
            }
            return Ok(new { status = false, message = "Request to be performed by a lecture or admin ", data = "" });
        }
    }
}

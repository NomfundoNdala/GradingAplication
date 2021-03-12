using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Helpers;
using gradingSystemAPI.Models.Assigments;
using gradingSystemAPI.Models.Lecturer;
using gradingSystemAPI.Models.Students;
using gradingSystemAPI.Models.users;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace gradingSystemAPI.Controllers
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
        public async Task<IActionResult> Create([FromBody] LectureDTO newLecture)
        {

            //var claims = Request.GetJwtClaims();

            //if (!claims.IsValidLogin())
            //    return claims.Get401Result();

            //if (!claims.Admin)
            //{
            //    return Ok(new { status = false, message = "Request to be performed by a lecture or admin ", data = "" });
            //}

            var exixstinDoctor = await
                _mongoRepositoryAccountDetails.FindOneAsync(x => x.Username.Equals(newLecture.StuffNumber));
            if (exixstinDoctor != null)
            {
                return BadRequest(new { status = false, message = "Account already exist", data = exixstinDoctor });
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
            await _mongoRepositoryAccountDetails.InsertOneAsync(account);
            await _mogoRepositoryLecture.InsertOneAsync(lecture);

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
                var oldGroup = _mongoRepositoryGroup.FindOne(x => x.GroupName.Equals(group.GroupName.ToLower()));

                var gTemp = string.Empty;
                var groups = _mongoRepositoryGroup.AsQueryable().ToList();
                if (groups.Count == 0)
                {
                    var g = new Group()
                    {
                        GroupId = @group.GroupId,
                        GroupName = @group.GroupName,
                        Assignemts = new List<Assignment>() { }
                    };
                    await _mongoRepositoryGroup.InsertOneAsync(g);
                    return Ok(new { status = true, message = "successful request", data = @group });
                }
                foreach (var grp in groups)
                {
                    if (!grp.GroupName.ToLower().Equals(group.GroupName.ToLower()))
                    {
                        gTemp = grp.GroupName;
                    }
                }
                if (gTemp != string.Empty)
                {
                    var g = new Group()
                    {
                        GroupId = @group.GroupId,
                        GroupName = @group.GroupName,
                        Assignemts = new List<Assignment>() { }
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
        [HttpGet]
        [Route("getAllGroups")]
        public IActionResult GetAllGroups()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            var details = _mongoRepositoryGroup.AsQueryable().ToList();
            if (details == null)
            {
                return BadRequest(new { status = false, message = "account id cannot be null or empty", data = "" });
            }
            return Ok(new { status = true, message = "successful request", data = details });
        }
    }
}

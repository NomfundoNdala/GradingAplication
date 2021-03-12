using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Helpers;
using gradingSystemAPI.Models.Assigments;
using gradingSystemAPI.Models.Students;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gradingSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IMongoRepository<Students> _mongoRepositoryStudents;
        private readonly IMongoRepository<Group> _mongoRepositoryGroup;
        private readonly IMongoRepository<Assignment> _mongoRepositoryAssigment;

        public StudentController(IMongoRepository<Students> mongoRepositoryStudents, IMongoRepository<Group> mongoRepositoryGroup, IMongoRepository<Assignment> mongoRepositoryAssigment)
        {
            _mongoRepositoryStudents = mongoRepositoryStudents;
            _mongoRepositoryGroup = mongoRepositoryGroup;
            _mongoRepositoryAssigment = mongoRepositoryAssigment;
        }
        [HttpGet]
        [Route("getAll")]
        public IActionResult GetAll()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var allPatient = _mongoRepositoryStudents.AsQueryable().ToList();
            return Ok(new { status = true, message = "successful request", data = allPatient });
        }
        [HttpGet]
        [Route("getStudent")]
        public IActionResult GetStudent(string studentNumber)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();
            if (string.IsNullOrEmpty(studentNumber))
                return BadRequest(new { status = true, message = "student Number cannot be null or empty", data = studentNumber });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var st = _mongoRepositoryStudents.FindOne(x => x.StudentNumber.Equals(studentNumber));
            return Ok(new { status = true, message = "successful request", data = st });
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] StudentDto newStudents)
        {

            var exixstinStudent = await _mongoRepositoryStudents.FindOneAsync(x => x.StudentNumber.Equals(newStudents.StudentNumber));
            if (exixstinStudent != null)
            {
                return BadRequest(new { status = false, message = "Students already exist", data = "" });
            }

            var nameOfTheGroup = CheckIfGroupExist(newStudents.Groupname);
            if (string.IsNullOrEmpty(CheckIfGroupExist(nameOfTheGroup)))
            {
                return BadRequest(new { status = false, message = $"Students Group {newStudents.Groupname} does not exist", data = "" });
            }
            var student = new Students()
            {
                GroupName = nameOfTheGroup,
                Name = newStudents.Name,
                StudentNumber = newStudents.StudentNumber,
                TotalMark = "0",
                Surname = newStudents.Surname,
                UniqueId = Guid.NewGuid().ToString(),
                Assignments = new List<Assignment>()
            };
            await _mongoRepositoryStudents.InsertOneAsync(student);

            return Ok(new { status = true, message = "successful request", data = student });
        }

        [HttpGet]
        [Route("getStudentInAGroup")]
        public IActionResult GetStudentInAGroup(string groupName)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (string.IsNullOrEmpty(groupName))
                return BadRequest(new { status = true, message = "groupName cannot be null or empty", data = groupName });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var allstudentsInAGroup = _mongoRepositoryStudents.AsQueryable().Where(x => x.GroupName.Equals(groupName.ToLower()));
            return Ok(new { status = true, message = "successful request", data = allstudentsInAGroup });
        }

        [HttpPatch]
        [Route("updateStudent")]
        public IActionResult GetStudentInAGroup([FromBody] StudentDto student, string uniqueId)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            if (string.IsNullOrEmpty(uniqueId))
                return BadRequest(new { status = true, message = "uniqueId cannot be null or empty", data = uniqueId });

            var studentOld = _mongoRepositoryStudents.FindOne(x => x.UniqueId.Equals(uniqueId));

            if (studentOld == null)
            {
                return BadRequest(new { status = false, message = "Student does not exist", data = "" });
            }
            studentOld.GroupName = student.Groupname;
            studentOld.StudentNumber = student.StudentNumber;
            studentOld.Name = student.Name;
            studentOld.Surname = student.Surname;
            studentOld.TotalMark = student.TotalMark;
            _mongoRepositoryStudents.ReplaceOne(studentOld);

            return Ok(new { status = true, message = "successful request", data = studentOld });
        }

        [HttpPost]
        [Route("MarkedAssigment")]
        public async Task<IActionResult> MarkedAssigment([FromBody] AssignmentDTO data)
        {

            if (string.IsNullOrEmpty(data.GroupName))
                return BadRequest(new { status = true, message = "GroupName cannot be null or empty", data = data.GroupName });

            var nameOfTheGroup = CheckIfGroupExist(data.GroupName);
            if (string.IsNullOrEmpty(nameOfTheGroup))
            {
                return BadRequest(new { status = false, message = $"Students Group {data.GroupName} does not exist", data = "" });
            }

            var foundAssigment = await _mongoRepositoryAssigment.FindOneAsync(x => x.Name.Equals(data.Data.Name));

            if (foundAssigment != null)
            {
                return BadRequest(new { status = false, message = $"Assigment {data.Data.Name} already marked", data = "" });
            }

            var asgmnt = new Assignment()
            {
                AssigmentId = Guid.NewGuid().ToString(),
                GroupName = nameOfTheGroup,
                MainTitle = data.Data.MainTitle,
                Name = data.Data.Name,
                Total = data.Data.Total,
                Weight = data.Data.Weight
            };
            var studentOfThisGroup = _mongoRepositoryStudents.AsQueryable().Where(x => x.GroupName.Equals(nameOfTheGroup)).ToList();
            foreach (var stud in studentOfThisGroup)
            {
                stud.Assignments.Add(asgmnt);
                await _mongoRepositoryStudents.ReplaceOneAsync(stud);
            }
            await _mongoRepositoryAssigment.InsertOneAsync(asgmnt);

            return Ok(new { status = true, message = "successful request", data = asgmnt });
        }

        private string CheckIfGroupExist(string grpName)
        {
            var g = string.Empty;
            var groups = _mongoRepositoryGroup.AsQueryable().ToList();
            foreach (var group in groups)
            {
                if (group.GroupName.ToLower().Equals(grpName.ToLower()))
                {
                    g = group.GroupName;
                }
            }

            return g;
        }
    }
}

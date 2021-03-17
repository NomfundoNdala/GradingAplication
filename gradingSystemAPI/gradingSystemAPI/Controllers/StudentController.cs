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
                return Ok(new { status = true, message = "student Number cannot be null or empty", data = studentNumber });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var st = _mongoRepositoryStudents.FindOne(x => x.StudentNumber.Equals(studentNumber));
            return Ok(new { status = true, message = "successful request", data = st });
        }

        [HttpGet]
        [Route("getStudentUniqueId")]
        public async Task<IActionResult> GetStudentUniqueId(string uniqueId)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();
            if (string.IsNullOrEmpty(uniqueId))
                return Ok(new { status = false, message = "student Number cannot be null or empty", data = uniqueId });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var st = await _mongoRepositoryStudents.FindOneAsync(x => x.UniqueId.Equals(uniqueId));
            return Ok(st == null ? new { status = false, message = "Student does not exist", data = st } : new { status = true, message = "successful request", data = st });
        }

        [HttpDelete]
        [Route("deleteStudentUniqueId")]
        public async Task<IActionResult> DeleteStudentUniqueId(string uniqueId)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();
            if (string.IsNullOrEmpty(uniqueId))
                return Ok(new { status = true, message = "student Number cannot be null or empty", data = uniqueId });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var st = await _mongoRepositoryStudents.FindOneAsync(x => x.UniqueId.Equals(uniqueId));
            if (st == null)
            {
                return Ok(new { status = false, message = "Student does not exist", data = st });
            }

            await _mongoRepositoryStudents.DeleteOneAsync(x => x.UniqueId.Equals(uniqueId));
            return Ok(new { status = true, message = "successful request", data = st });
        }
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] StudentDto newStudents)
        {

            var exixstinStudent = await _mongoRepositoryStudents.FindOneAsync(x => x.StudentNumber.Equals(newStudents.StudentNumber));
            if (exixstinStudent != null)
            {
                return Ok(new { status = false, message = "Students already exist", data = "" });
            }

            var nameOfTheGroup = CheckIfGroupExist(newStudents.Groupname);
            if (string.IsNullOrEmpty(nameOfTheGroup.Item1))
            {
                return Ok(new { status = false, message = $"Students Group {newStudents.Groupname} does not exist", data = "" });
            }
            var student = new Students()
            {
                GroupName = nameOfTheGroup.Item1,
                GroupId = nameOfTheGroup.Item2,
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
        public async Task<IActionResult> GetStudentInAGroup(string groupId)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (string.IsNullOrEmpty(groupId))
                return BadRequest(new { status = false, message = "groupName cannot be null or empty", data = groupId });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var gr = await _mongoRepositoryGroup.FindOneAsync(x => x.GroupId.Equals(groupId));
            if (gr == null)
            {
                return Ok(new { status = false, message = "Group not found", data = groupId });
            }

            var allstudentsInAGroup = _mongoRepositoryStudents.AsQueryable().Where(x => x.GroupName.Equals(gr.GroupName));
            return Ok(new { status = true, message = "successful request", data = allstudentsInAGroup });
        }

        [HttpGet]
        [Route("getGroup")]
        public async Task<IActionResult> GetGroup(string groupId)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (string.IsNullOrEmpty(groupId))
                return Ok(new { status = false, message = "groupName cannot be null or empty", data = groupId });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var gr = await _mongoRepositoryGroup.FindOneAsync(x => x.GroupId.Equals(groupId));
            if (gr == null)
            {
                return Ok(new { status = false, message = "Group not found", data = groupId });
            }

            //var allstudentsInAGroup = _mongoRepositoryStudents.AsQueryable().Where(x => x.GroupName.Equals(gr.GroupName));
            return Ok(new { status = true, message = "successful request", data = gr });
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
                return Ok(new { status = false, message = "uniqueId cannot be null or empty", data = uniqueId });

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
            if (string.IsNullOrEmpty(nameOfTheGroup.Item1))
            {
                return Ok(new { status = false, message = $"Students Group {data.GroupName} does not exist", data = "" });
            }

            var foundAssigment = await _mongoRepositoryAssigment.FindOneAsync(x => x.Name.Equals(data.Data.Name));
            var asgmnt = new Assignment();
            if (foundAssigment != null)
            {
                asgmnt.AssigmentId = foundAssigment.AssigmentId;
                asgmnt.GroupName = foundAssigment.GroupName;
                asgmnt.MainTitle = data.Data.MainTitle;
                asgmnt.Name = data.Data.Name;
                asgmnt.Total = data.Data.Total;
                asgmnt.Weight = data.Data.Weight;
                asgmnt.Id = foundAssigment.Id;

                await _mongoRepositoryAssigment.ReplaceOneAsync(asgmnt);
            }
            else
            {
                asgmnt.AssigmentId = Guid.NewGuid().ToString();
                asgmnt.GroupName = nameOfTheGroup.Item1;
                asgmnt.MainTitle = data.Data.MainTitle;
                asgmnt.Name = data.Data.Name;
                asgmnt.Total = data.Data.Total;
                asgmnt.Weight = data.Data.Weight;
                await _mongoRepositoryAssigment.InsertOneAsync(asgmnt);
            }
            var learnerMarkTotal = 0;

            foreach (var c in asgmnt.MainTitle)
            {
                learnerMarkTotal += Convert.ToInt32(c.Content.LearnerMark);
            }

            var grTotal = ((learnerMarkTotal / Convert.ToInt32(asgmnt.Total)) * 100) * (asgmnt.Weight / 100);

            var studentOfThisGroup = _mongoRepositoryStudents.AsQueryable().Where(x => x.GroupId.Equals(nameOfTheGroup.Item2)).ToList();
            foreach (var stud in studentOfThisGroup)
            {
                var newAssigmentList = stud.Assignments;
                for (var i = 0; i < newAssigmentList.Count; i++)
                {
                    if (newAssigmentList[i].Name.Equals(asgmnt.Name))
                    {
                        newAssigmentList[i] = asgmnt;
                    }
                }
                stud.Assignments = newAssigmentList;
                stud.TotalMark = grTotal.ToString();
                await _mongoRepositoryStudents.ReplaceOneAsync(stud);
            }

            var gr = await _mongoRepositoryGroup.FindOneAsync(x => x.GroupId.Equals(nameOfTheGroup.Item2));
            gr.Assignemts.Add(asgmnt);

            await _mongoRepositoryGroup.ReplaceOneAsync(gr);


            return Ok(new { status = true, message = "successful request", data = asgmnt });
        }


        [HttpPatch]
        [Route("UpdateAssigment")]
        public async Task<IActionResult> UpdateAssigment([FromBody] AssignmentUpdateDTO data)
        {

            if (string.IsNullOrEmpty(data.GroupName))
                return Ok(new { status = false, message = "GroupName cannot be null or empty", data = data });

            var nameOfTheGroup = CheckIfGroupExist(data.GroupName);
            if (string.IsNullOrEmpty(nameOfTheGroup.Item1))
            {
                return Ok(new { status = false, message = $"Students Group {data.AssigmentId} does not exist", data = "" });
            }

            var foundAssigment = await _mongoRepositoryAssigment.FindOneAsync(x => x.AssigmentId.Equals(data.AssigmentId));

            if (foundAssigment == null)
            {
                return Ok(new { status = false, message = $"Assigment {data.Data.Name} not found", data = "" });
            }

            foundAssigment.Total = data.Data.Total;
            foundAssigment.MainTitle = data.Data.MainTitle;
            foundAssigment.Weight = data.Data.Weight;
            foundAssigment.Name = foundAssigment.Name;

            await _mongoRepositoryAssigment.ReplaceOneAsync(foundAssigment);


            var gr = await _mongoRepositoryGroup.FindOneAsync(x => x.GroupId.Equals(nameOfTheGroup.Item2));
            var oldAssignents = new List<Assignment>();
            foreach (var ass in gr.Assignemts)
            {
                if (ass.AssigmentId != null && ass.AssigmentId.Equals(foundAssigment.AssigmentId))
                {
                    ass.MainTitle = data.Data.MainTitle;
                    ass.Total = data.Data.Total;
                    ass.Weight = data.Data.Weight;
                    ass.Name = data.Data.Name;
                }
                oldAssignents.Add(ass);
            }
            gr.Assignemts = oldAssignents;
            await _mongoRepositoryGroup.ReplaceOneAsync(gr);



            var studentOfThisGroup = _mongoRepositoryStudents.AsQueryable().Where(x => x.GroupId.Equals(nameOfTheGroup.Item2)).ToList();

            foreach (var stud in studentOfThisGroup)
            {
                var oldAssigmentStud = new List<Assignment>();
                var studTotal = 0;
                foreach (var studAss in stud.Assignments)
                {

                    if (studAss.AssigmentId != null && studAss.AssigmentId.Equals(foundAssigment.AssigmentId))
                    {
                        studAss.MainTitle = data.Data.MainTitle;
                        studAss.Total = data.Data.Total;
                        studAss.Weight = data.Data.Weight;
                        studAss.Name = data.Data.Name;
                    }
                    oldAssigmentStud.Add(studAss);
                    var learnerMarkTotal = 0;
                    foreach (var c in studAss.MainTitle)
                    {
                        learnerMarkTotal += Convert.ToInt32(c.Content.LearnerMark);
                    }
                    var grTotal = ((learnerMarkTotal / Convert.ToInt32(studAss.Total)) * 100) * (studAss.Weight / 100);
                    studTotal += grTotal;
                }

                stud.Assignments = oldAssigmentStud;
                stud.TotalMark = studTotal.ToString();
                await _mongoRepositoryStudents.ReplaceOneAsync(stud);
            }

            return Ok(new { status = true, message = "successful request", data = foundAssigment });
        }


        [HttpPatch]
        [Route("UpdateAssigmentStudent")]
        public async Task<IActionResult> UpdateAssigmentStudent([FromBody] AssignmentUpdateDTO data, string uniqueId)
        {

            if (string.IsNullOrEmpty(uniqueId))
                return Ok(new { status = false, message = "GroupName cannot be null or empty", data = data });


            var student = await _mongoRepositoryStudents.FindOneAsync(x => x.UniqueId.Equals(uniqueId));

            if (student == null)
            {
                return BadRequest(new { status = false, message = $"Student with {uniqueId} not found", data = "" });
            }

            var oldAssigmentStud = new List<Assignment>();
            var studTotal = 0;
            foreach (var studAss in student.Assignments)
            {

                if (studAss.AssigmentId != null && studAss.AssigmentId.Equals(data.AssigmentId))
                {
                    studAss.MainTitle = data.Data.MainTitle;
                    studAss.Total = data.Data.Total;
                    studAss.Weight = data.Data.Weight;
                    studAss.Name = data.Data.Name;
                }
                oldAssigmentStud.Add(studAss);
                var learnerMarkTotal = 0;
                foreach (var c in studAss.MainTitle)
                {
                    learnerMarkTotal += Convert.ToInt32(c.Content.LearnerMark);
                }
                var grTotal = ((learnerMarkTotal / Convert.ToInt32(studAss.Total)) * 100) * (studAss.Weight / 100);
                studTotal += grTotal;
            }

            student.Assignments = oldAssigmentStud;
            student.TotalMark = studTotal.ToString();
            await _mongoRepositoryStudents.ReplaceOneAsync(student);


            return Ok(new { status = true, message = "successful request", data = student });
        }

        private (string, string) CheckIfGroupExist(string grpName)
        {
            var g = string.Empty;
            var i = string.Empty;
            var groups = _mongoRepositoryGroup.AsQueryable().ToList();
            foreach (var group in groups)
            {
                if (group.GroupName.ToLower().Equals(grpName.ToLower()))
                {
                    g = group.GroupName;
                    i = group.GroupId;
                }
            }

            return (g, i);
        }
    }
}

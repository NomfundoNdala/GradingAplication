﻿using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Helpers;
using gradingSystemAPI.Models.Students;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace gradingSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IMongoRepository<Students> _mongoRepositoryStudents;
        private readonly IMongoRepository<Group> _mongoRepositoryGroup;

        public StudentController(IMongoRepository<Students> mongoRepositoryStudents, IMongoRepository<Group> mongoRepositoryGroup)
        {
            _mongoRepositoryStudents = mongoRepositoryStudents;
            _mongoRepositoryGroup = mongoRepositoryGroup;
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
                return BadRequest(new { status = true, message = "groupName cannot be null or empty", data = studentNumber });

            if (!claims.IsLecture) return Ok(new { status = false, message = "Request to be done by Lecture", data = "" });

            var st = _mongoRepositoryStudents.FindOne(x => x.StudentNumber.Equals(studentNumber));
            return Ok(new { status = true, message = "successful request", data = st });
        }

        [HttpPost]
        [Route("create")]
        public IActionResult Create([FromBody] StudentDto newStudents)
        {

            var exixstinStudent = _mongoRepositoryStudents.FindOneAsync(x => x.StudentNumber.Equals(newStudents.StudentNumber)).Result;
            if (exixstinStudent != null)
            {
                return BadRequest(new { status = false, message = "Students already exist", data = "" });
            }

            var g = string.Empty;
            var groups = _mongoRepositoryGroup.AsQueryable().ToList();
            foreach (var group in groups)
            {
                if (group.GroupName.ToLower().Equals(newStudents.Groupname.ToLower()))
                {
                    g = group.GroupName;
                }
            }
            if (g == string.Empty)
            {
                return BadRequest(new { status = false, message = $"Students Group {newStudents.Groupname} does not exist", data = "" });
            }
            var student = new Students()
            {
                GroupName = g,
                Name = newStudents.Name,
                StudentNumber = newStudents.StudentNumber,
                TotalMark = "0",
                Surname = newStudents.Surname,
                UniqueId = Guid.NewGuid().ToString()
            };
            _mongoRepositoryStudents.InsertOneAsync(student);

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
    }
}

using doctorappoinmentsApI.Helpers;
using doctorappoinmentsApI.Models.Doctors;
using doctorappoinmentsApI.Models.Mongo;
using doctorappoinmentsApI.Models.Patients;
using doctorappoinmentsApI.Models.users;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Linq;


namespace doctorappoinmentsApI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly IMongoRepository<Doctor> _mongoRepositoryDoctor;
        private readonly IMongoRepository<Patient> _mongoRepositoryPatients;
        private readonly IMongoRepository<AccountDetails> _mongoRepositoryAccountDetails;

        public DoctorsController(IMongoRepository<Doctor> mongoRepositoryDoctor,
            IMongoRepository<Patient> mongoRepositoryPatients, IMongoRepository<AccountDetails> mongoRepositoryAccountDetails)
        {
            _mongoRepositoryDoctor = mongoRepositoryDoctor;
            _mongoRepositoryPatients = mongoRepositoryPatients;
            _mongoRepositoryAccountDetails = mongoRepositoryAccountDetails;
        }

        [HttpGet]
        [Route("getAll")]
        public IActionResult GetAll()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (!claims.IsDoctor) return Ok(new { status = false, message = "Request to be done by doctor", data = "" });

            var allDoctors = _mongoRepositoryDoctor.AsQueryable().ToList();
            return Ok(new { status = true, message = "successful request", data = allDoctors });

        }

        [HttpPost]
        [Route("create")]
        public IActionResult Create([FromBody] DoctorDTO newDoctor)
        {

            var exixstinDoctor =
                _mongoRepositoryAccountDetails.FindOneAsync(x => x.Username.Equals(newDoctor.IdNumber.ToString())).Result;
            if (exixstinDoctor != null)
            {
                return BadRequest(new { status = false, message = "Account already exist", data = "" });
            }
            var doctor = new Doctor()
            {
                HospitalAddress = newDoctor.Address,
                Email = newDoctor.Email,
                FirstName = newDoctor.FirstName,
                Gender = newDoctor.Gender,
                IdNumber = newDoctor.IdNumber,
                userId = Guid.NewGuid(),
                LastName = newDoctor.LastName,
                Password = newDoctor.Password,
                PhoneNumber = newDoctor.PhoneNumber,
                Specialiazation = newDoctor.Specialiazation,
                Surname = newDoctor.Surname,
                Picture = newDoctor.Picture
            };
            var account = new AccountDetails()
            {
                AccountId = doctor.userId,
                CreateDateTime = DateTime.Now,
                Password = doctor.Password,
                Username = doctor.IdNumber.ToString(),
                Name = doctor.FirstName,
                Surname = doctor.Surname,
                IdNumber = doctor.IdNumber.ToString(),
                Admin = false,
                IsDoctor = false
            };

            _mongoRepositoryAccountDetails.InsertOneAsync(account);
            _mongoRepositoryDoctor.InsertOneAsync(doctor);

            return Ok(new { status = true, message = "successful request", data = doctor });
        }

        [HttpGet]
        [Route("getDetails")]
        public IActionResult GetDetails()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            var details = _mongoRepositoryDoctor.FindOneAsync(x => x.userId.Equals(claims.AccountId));
            if (details == null)
            {
                return BadRequest(new { status = false, message = "account id cannot be null or empty", data = "" });
            }


            return Ok(new { status = true, message = "successful request", data = details });
        }


        [HttpGet]
        [Route("getDetailsOfPatient")]
        public IActionResult GetDetailsOfPatient(string id)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (claims.Admin || claims.IsDoctor)
            {
                var patient = _mongoRepositoryPatients.FindOne(x => x.Id.Equals(ObjectId.Parse(id)));

                return Ok(new { status = true, message = "successful request", data = patient });
            }

            return Ok(new { status = false, message = "Request to be performed by a doctor or admin", data = id });
        }
        [HttpDelete]
        [Route("deleteDetails")]
        public IActionResult DeleteDetails(string accountId)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (string.IsNullOrEmpty(accountId))
                return BadRequest(new { status = true, message = "account id cannot be null or empty", data = accountId });


            if (claims.IsDoctor || claims.Admin)
            {
                var details = _mongoRepositoryPatients.DeleteOneAsync(x => x.userId.Equals(Guid.Parse(accountId)));
                return Ok(new { status = true, message = "File Deleted", data = details });
            }

            return Ok(new { status = false, message = "Request to be performed by a doctor or admin", data = accountId });
        }

        [HttpPatch]
        [Route("updateDetails")]
        public IActionResult UpdateDetails([FromBody] DoctorDTO newDoctor)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            if (claims.IsDoctor || claims.Admin)
            {
                var oldDetails = _mongoRepositoryDoctor.FindOne(x => x.userId.Equals(claims.AccountId));

                oldDetails.HospitalAddress = newDoctor.Address;
                oldDetails.Email = newDoctor.Email;
                oldDetails.FirstName = newDoctor.FirstName;
                oldDetails.Gender = newDoctor.Gender;
                oldDetails.IdNumber = newDoctor.IdNumber;
                oldDetails.LastName = newDoctor.LastName;
                oldDetails.Password = newDoctor.Password;
                oldDetails.PhoneNumber = newDoctor.PhoneNumber;
                oldDetails.Specialiazation = newDoctor.Specialiazation;
                oldDetails.Surname = newDoctor.Surname;

                _mongoRepositoryDoctor.ReplaceOneAsync(oldDetails);
                return Ok(new { status = true, message = "successful request", data = newDoctor });
            }



            return Ok(new { status = false, message = "Request to be performed by a doctor ", data = "" });
        }
    }
}

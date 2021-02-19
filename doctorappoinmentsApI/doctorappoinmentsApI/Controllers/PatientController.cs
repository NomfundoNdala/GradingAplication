using doctorappoinmentsApI.Helpers;
using doctorappoinmentsApI.Models.Mongo;
using doctorappoinmentsApI.Models.Patients;
using doctorappoinmentsApI.Models.users;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace doctorappoinmentsApI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IMongoRepository<Patient> _mongoRepositoryPatients;
        private readonly IMongoRepository<AccountDetails> _mongoRepositoryAccountDetails;

        public PatientController(IMongoRepository<Patient> mongoRepositoryPatients, IMongoRepository<AccountDetails> mongoRepositoryAccountDetails)
        {
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

            var allPatient = _mongoRepositoryPatients.AsQueryable().ToList();
            return Ok(new { status = true, message = "successful request", data = allPatient });

        }

        [HttpPost]
        [Route("create")]
        public IActionResult Create([FromBody] PatientsDTO newPatient)
        {

            var exixstinPatient =
                _mongoRepositoryAccountDetails.FindOneAsync(x => x.Username.Equals(newPatient.IdNumber.ToString())).Result;
            if (exixstinPatient != null)
            {
                return BadRequest(new { status = false, message = "Patient already exist", data = "" });
            }
            var patient = new Patient()
            {
                Address = newPatient.Address,
                Email = newPatient.Email,
                FirstName = newPatient.FirstName,
                Gender = newPatient.Gender,
                IdNumber = newPatient.IdNumber,
                userId = Guid.NewGuid(),
                LastName = newPatient.LastName,
                Password = newPatient.Password,
                PhoneNumber = newPatient.PhoneNumber,
                Prescription = string.Empty,
                Surname = newPatient.Surname,
            };
            var account = new AccountDetails()
            {
                AccountId = patient.userId,
                CreateDateTime = DateTime.Now,
                Password = patient.Password,
                Username = patient.IdNumber.ToString(),
                Name = patient.FirstName,
                Surname = patient.Surname,
                IdNumber = patient.IdNumber.ToString(),
                Admin = false,
                IsDoctor = false
            };

            _mongoRepositoryAccountDetails.InsertOneAsync(account);
            _mongoRepositoryPatients.InsertOneAsync(patient);

            return Ok(new { status = true, message = "successful request", data = patient });
        }

        [HttpGet]
        [Route("getDetails")]
        public IActionResult getDetails()
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();


            var details = _mongoRepositoryPatients.FindOneAsync(x => x.userId.Equals(claims.AccountId));
            if (details == null)
            {
                return BadRequest(new { status = false, message = "account id cannot be null or empty", data = "" });
            }


            return Ok(new { status = true, message = "successful request", data = details });
        }


        [HttpPatch]
        [Route("updateDetails")]
        public IActionResult UpdateDetails([FromBody] PatientsDTO newPatient)
        {
            var claims = Request.GetJwtClaims();

            if (!claims.IsValidLogin())
                return claims.Get401Result();

            var oldDetails = _mongoRepositoryPatients.FindOne(x => x.userId.Equals(claims.AccountId));
            if (oldDetails != null || claims.IsDoctor || claims.Admin)
            {
                oldDetails = _mongoRepositoryPatients.FindOne(x => x.IdNumber.Equals(newPatient.IdNumber));
                if (oldDetails == null)
                    return Ok(new { status = false, message = "id does not exist", data = oldDetails });

                oldDetails.Address = newPatient.Address;
                oldDetails.Email = newPatient.Email;
                oldDetails.FirstName = newPatient.FirstName;
                oldDetails.Gender = newPatient.Gender;
                oldDetails.IdNumber = newPatient.IdNumber;
                oldDetails.LastName = newPatient.LastName;
                oldDetails.Password = newPatient.Password;
                oldDetails.PhoneNumber = newPatient.PhoneNumber;
                oldDetails.Surname = newPatient.Surname;

                _mongoRepositoryPatients.ReplaceOneAsync(oldDetails);
                return Ok(new { status = true, message = "successful request", data = oldDetails });
            }

            return Ok(new { status = false, message = "Request to be performed by a doctor ", data = newPatient });

        }
    }
}
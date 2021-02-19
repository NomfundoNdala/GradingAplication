using System.Collections.Generic;

namespace doctorappoinmentsApI.Models.Doctors
{
    public class DoctorDTO
    {
        public int IdNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Specialiazation { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Surname { get; set; }

        public string? Picture { get; set; }
        public string Password { get; set; }
    }
}

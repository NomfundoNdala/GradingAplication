using doctorappoinmentsApI.Models.Mongo;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace doctorappoinmentsApI.Models.Patients
{
    [BsonCollection("Patients")]
    [BsonIgnoreExtraElements]
    public class Patient : Document
    {
        public Guid userId { get; set; }
        public int IdNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Prescription { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
    }
}

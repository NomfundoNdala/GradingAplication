using doctorappoinmentsApI.Models.Mongo;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace doctorappoinmentsApI.Models.Lecturer
{
    [BsonCollection("Lecture")]
    [BsonIgnoreExtraElements]
    public class Lecture : Document

    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string StuffNumber { get; set; }
        public string Email { get; set; }
        public Guid AccountId { get; set; }
        public string Password { get; set; }
    }
}

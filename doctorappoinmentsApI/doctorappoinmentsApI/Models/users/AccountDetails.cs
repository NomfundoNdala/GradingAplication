#nullable enable
using doctorappoinmentsApI.Models.Mongo;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace doctorappoinmentsApI.Models.users
{
    [BsonCollection("AccountDetails")]
    [BsonIgnoreExtraElements]
    public class AccountDetails : Document
    {
        public Guid AccountId { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public bool IsLecture { get; set; }
        public bool Admin { get; set; }
        public DateTime CreateDateTime { get; set; }

    }
}

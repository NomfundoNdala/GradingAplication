using doctorappoinmentsApI.Models.Mongo;
using System.Collections.Generic;

namespace doctorappoinmentsApI.Models.Students
{
    [BsonCollection("Group")]
    public class Group : Document
    {
        public string GroupName { get; set; }
        public string Groupid { get; set; }
        public Dictionary<string, string[]> Marks { get; set; }
    }
}

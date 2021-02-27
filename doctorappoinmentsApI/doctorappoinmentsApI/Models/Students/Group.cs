using doctorappoinmentsApI.Models.Mongo;
using System.Collections.Generic;

namespace doctorappoinmentsApI.Models.Students
{
    [BsonCollection("Group")]
    public class Group : Document
    {
        public string GroupName { get; set; }
        public string GroupId { get; set; }
        public Dictionary<string, Marks.Marks> Assignemts { get; set; }
    }
}

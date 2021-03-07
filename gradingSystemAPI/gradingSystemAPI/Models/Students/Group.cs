using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Models.Mongo;
using System.Collections.Generic;

namespace gradingSystemAPI.Models.Students
{
    [BsonCollection("Group")]
    public class Group : Document
    {
        public string GroupName { get; set; }
        public string GroupId { get; set; }
        public Dictionary<string, Marks.Marks> Assignemts { get; set; }
    }
}

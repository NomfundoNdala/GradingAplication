using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Models.Assigments;
using gradingSystemAPI.Models.Mongo;
using System.Collections.Generic;

namespace gradingSystemAPI.Models.Students
{
    [BsonCollection("Students")]
    public class Students : Document
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string StudentNumber { get; set; }
        public string TotalMark { get; set; }
        public string UniqueId { get; set; }
        public string GroupName { get; set; }

        public List<Assignment> Assignments { get; set; }

    }
}

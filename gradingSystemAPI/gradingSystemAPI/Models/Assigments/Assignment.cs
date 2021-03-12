using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Models.Mongo;
using System.Collections.Generic;

namespace gradingSystemAPI.Models.Assigments
{
    [BsonCollection("Assignments")]
    public class Assignment : Document
    {
        public string? GroupName { get; set; }
        public string? AssigmentId { get; set; }
        public string Name { get; set; }
        public int Total { get; set; }
        public int Weight { get; set; }

        public List<MainTitleContent> MainTitle { get; set; }
    }

    public class MainTitleContent
    {
        public SubContent Content { get; set; }
        public string Description { get; set; }
    }

    public class SubContent
    {
        public string Comment { get; set; }
        public int LearnerMark { get; set; }
        public int TotalMark { get; set; }
    }
}

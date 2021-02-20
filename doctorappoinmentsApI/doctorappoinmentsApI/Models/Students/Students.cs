using doctorappoinmentsApI.Models.Mongo;

namespace doctorappoinmentsApI.Models.Students
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

    }
}

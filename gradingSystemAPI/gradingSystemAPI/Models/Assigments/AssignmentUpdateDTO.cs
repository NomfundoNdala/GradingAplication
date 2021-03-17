namespace gradingSystemAPI.Models.Assigments
{
    public class AssignmentUpdateDTO
    {
        public string AssigmentId { get; set; }
        public string GroupName { get; set; }
        public Assignment Data { get; set; }
    }
}

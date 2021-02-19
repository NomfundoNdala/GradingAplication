using doctorappoinmentsApI.Models.Mongo;

namespace doctorappoinmentsApI.Models
{
    public class MongoDbSettings : IMongoDbSettings
    {
        public string DatabaseName { get; set; }
        public string ConnectionString { get; set; }
    }
}
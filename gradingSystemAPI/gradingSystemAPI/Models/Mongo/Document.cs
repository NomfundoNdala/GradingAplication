using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace doctorappoinmentsApI.Models.Mongo
{
    public abstract class Document : IBaseDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public ObjectId Id { get; set; }
    }
}

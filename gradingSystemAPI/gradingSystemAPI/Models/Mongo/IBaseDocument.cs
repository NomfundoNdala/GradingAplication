using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace doctorappoinmentsApI.Models.Mongo
{
    public interface IBaseDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        ObjectId Id { get; set; }
    }
}

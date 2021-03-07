using doctorappoinmentsApI.Models.Mongo;
using gradingSystemAPI.Models.Mongo;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace gradingSystemAPI.Repo
{
    //https://medium.com/@marekzyla95/mongo-repository-pattern-700986454a0e
    public class MongoRepository<TDocument> : IMongoRepository<TDocument>
        where TDocument : IBaseDocument
    {
        private readonly IMongoCollection<TDocument> _collection;

        public MongoRepository(IMongoDbSettings settings, ILogger<TDocument> logger)
        {
            var logger1 = logger ?? throw new ArgumentNullException(nameof(logger));
            var database = new MongoClient(settings.ConnectionString);
            var dataBaseName = database.GetDatabase(settings.DatabaseName);
            // _collection = database.GetCollection<TDocument>(GetCollectionName(typeof(TDocument)));
            try
            {
                _collection = dataBaseName.GetCollection<TDocument>(GetCollectionName(typeof(TDocument)));
            }
            catch (Exception e)
            {
                dataBaseName.CreateCollection(GetCollectionName(typeof(TDocument)));
                _collection = dataBaseName.GetCollection<TDocument>(GetCollectionName(typeof(TDocument)));
            }

            logger1.LogInformation($"{nameof(TDocument)}  {database.Settings.Servers.Aggregate("", (a, b) => $"{a} {b.Host}:{b.Port}")} database {settings.DatabaseName}");
        }
        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }

        public virtual IQueryable<TDocument> AsQueryable()
        {
            return _collection.AsQueryable();
        }

        public virtual IEnumerable<TDocument> FilterBy(
            Expression<Func<TDocument, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).ToEnumerable();
        }

        public virtual IEnumerable<TProjected> FilterBy<TProjected>(
            Expression<Func<TDocument, bool>> filterExpression,
            Expression<Func<TDocument, TProjected>> projectionExpression)
        {
            return _collection.Find(filterExpression).Project(projectionExpression).ToEnumerable();
        }

        public virtual TDocument FindOne(Expression<Func<TDocument, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).FirstOrDefault();
        }

        public virtual Task<TDocument> FindOneAsync(Expression<Func<TDocument, bool>> filterExpression)
        {
            return Task.Run(() => _collection.Find(filterExpression).FirstOrDefaultAsync());
        }

        //public virtual TDocument FindById(string id)
        //{
        //    var objectId = new ObjectId(id);
        //    var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
        //    return _collection.Find(filter).SingleOrDefault();
        //}

        //public virtual Task<TDocument> FindByIdAsync(string id)
        //{
        //    return Task.Run(() =>
        //    {
        //        var objectId = new ObjectId(id);
        //        var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
        //        return _collection.Find(filter).SingleOrDefaultAsync();
        //    });
        //}


        public virtual void InsertOne(TDocument document)
        {
            _collection.InsertOne(document);
        }

        public virtual Task InsertOneAsync(TDocument document)
        {
            return Task.Run(() => _collection.InsertOneAsync(document));
        }

        public void InsertMany(ICollection<TDocument> documents)
        {
            _collection.InsertMany(documents);
        }


        public virtual async Task InsertManyAsync(ICollection<TDocument> documents)
        {
            await _collection.InsertManyAsync(documents);
        }

        public void ReplaceOne(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, document.Id);
            _collection.FindOneAndReplace(filter, document);
        }

        public virtual async Task ReplaceOneAsync(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, document.Id);
            await _collection.FindOneAndReplaceAsync(filter, document);
        }

        public virtual async Task UpdateOneAsync(FilterDefinition<TDocument> filterExpression, JsonUpdateDefinition<TDocument> updateDefinition)
        {
            await _collection.UpdateOneAsync(filterExpression, updateDefinition);
        }

        public void DeleteOne(Expression<Func<TDocument, bool>> filterExpression)
        {
            _collection.FindOneAndDelete(filterExpression);
        }

        public Task DeleteOneAsync(Expression<Func<TDocument, bool>> filterExpression)
        {
            return Task.Run(() => _collection.FindOneAndDeleteAsync(filterExpression));
        }

        public void DeleteById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
            _collection.FindOneAndDelete(filter);
        }

        public Task DeleteByIdAsync(string id)
        {
            return Task.Run(() =>
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
                _collection.FindOneAndDeleteAsync(filter);
            });
        }

        public void DeleteMany(Expression<Func<TDocument, bool>> filterExpression)
        {
            _collection.DeleteMany(filterExpression);
        }

        public Task DeleteManyAsync(Expression<Func<TDocument, bool>> filterExpression)
        {
            return Task.Run(() => _collection.DeleteManyAsync(filterExpression));
        }
    }
}

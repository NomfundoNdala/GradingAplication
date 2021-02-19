using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.ComponentModel;

namespace doctorappoinmentsApI.Models.users
{
    public class JwtClaims
    {
        [JsonProperty("a")] public Guid AccountId;

        [JsonIgnore] public bool Expired;

        [JsonProperty("exp")] public long Expires;

        [JsonIgnore] public bool Invalid;

        [JsonProperty("isDoctor", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        [DefaultValue(false)]
        public bool IsDoctor;

        [JsonProperty("admin", DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate)]
        [DefaultValue(false)]
        public bool Admin;


        [JsonIgnore] public DateTime ExpiresAt => new DateTime(DateTimeOffset.FromUnixTimeSeconds(Expires).Ticks);
        public ObjectResult Get401Result()
        {
            if (Expired)
                return new ObjectResult(new { isSuccessful = false, message = "JWT Expired" }) { StatusCode = 401 };

            if (Invalid)
                return new ObjectResult(new { isSuccessful = false, message = "JWT Invalid" }) { StatusCode = 401 };

            return new ObjectResult(new { isSuccessful = false, message = "Access denied" }) { StatusCode = 401 };
        }

        public static ObjectResult RequiresAdministrator()
        {
            return new ObjectResult(new { isSuccessful = false, message = "Requires an administrator" })
            { StatusCode = 403 };
        }

        public static ObjectResult WrongAccount(Guid loggedInAs, Guid belongsTo)
        {
            return new ObjectResult(new
            { isSuccessful = false, message = "Wrong account", data = new { loggedInAs, belongsTo } })
            { StatusCode = 403 };
        }

        public bool IsValidLogin()
        {
            return AccountId != Guid.Empty;
        }

    }
}

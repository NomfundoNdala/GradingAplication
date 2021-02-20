using doctorappoinmentsApI.Models.users;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using Microsoft.AspNetCore.Http;
using System;

namespace doctorappoinmentsApI.Helpers
{
    public static class JwtHelper
    {
        private static readonly IJwtAlgorithm Algorithm = new HMACSHA256Algorithm();
        private static readonly IJsonSerializer Serializer = new JsonNetSerializer();
        private static readonly IBase64UrlEncoder UrlEncoder = new JwtBase64UrlEncoder();
        private static readonly IJwtEncoder JwtEncoder = new JwtEncoder(Algorithm, Serializer, UrlEncoder);
        private static readonly IJwtValidator Validator = new JwtValidator(Serializer, new UtcDateTimeProvider());
        private static readonly IJwtDecoder JwtDecoder = new JwtDecoder(Serializer, Validator, UrlEncoder, Algorithm);

        public static string JwtSecret = "princeKohan";
        public static double ValidMinutes = 90000;

        public static string BuildJwt(Guid accountId,
            double? validMinutes = null,
            bool isLecture = false, bool admin = false)
        {
            if (JwtSecret == null)
                throw new InvalidOperationException($"{nameof(JwtHelper)}.{nameof(JwtSecret)} not initialized");

            validMinutes ??= ValidMinutes;

            if (validMinutes <= 0.01)
                throw new InvalidOperationException($"{nameof(JwtHelper)}.{nameof(ValidMinutes)} not initialized");

            var token = JwtEncoder.Encode(new JwtClaims
            {
                AccountId = accountId,
                Expires = DateTimeOffset.UtcNow.AddMinutes(validMinutes.Value).ToUnixTimeSeconds(),
                IsLecture = isLecture,
                Admin = admin
            }, JwtSecret);

            return token;
        }

        public static JwtClaims GetJwtClaims(string jwt)
        {
            if (jwt == null)
                return new JwtClaims();

            try
            {
                return JwtDecoder.DecodeToObject<JwtClaims>(jwt, JwtSecret, true);
            }
            catch (TokenExpiredException)
            {
                return new JwtClaims { Expired = true };
            }
            catch (SignatureVerificationException)
            {
                return new JwtClaims { Invalid = true };
            }
            catch
            {
                return new JwtClaims { Invalid = true };
            }
        }

        public static JwtClaims GetJwtClaims(this HttpRequest req)
        {
            return GetJwtClaims(req.GetBearerToken());
        }

        public static string GetBearerToken(this HttpRequest req)
        {
            if (req.Query.ContainsKey("jwt"))
                return req.Query["jwt"];

            var bearer = req.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(bearer) || !bearer.StartsWith("Bearer "))
                return null;

            return bearer.Substring("Bearer ".Length);
        }
    }
}

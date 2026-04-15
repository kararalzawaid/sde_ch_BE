export default {
  secret: process.env.AUTH_SECRET,
  jwtTokenExpiration: 3600, // 1 hour
  refreshTokenExpiration: 86400 * 7 // 1 week
};

import SystemException from "../../../share/exceptions/SystemException";
import JwtProvider from "../infrastructure/JwtProvider";

const SECRET = process.env.JWT_SECRET
const JWT_EXPIRATION = process.env.JWT_EXPIRATION

if (!SECRET) throw new SystemException("JWT_SECRET is not defined")
if (!JWT_EXPIRATION) throw new SystemException("JWT_EXPIRATION is not defined")

if (isNaN(Number(JWT_EXPIRATION))) throw new SystemException("JWT_EXPIRATION is not a number")

export const jwtProviderImpl = new JwtProvider(SECRET, Number(JWT_EXPIRATION))
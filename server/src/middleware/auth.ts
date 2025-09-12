// src/middleware/auth.ts
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

dotenv.config();

// This checks for a valid JWT in the Authorization header.
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE as string,
  issuerBaseURL: process.env.AUTH0_ISSUER_URL as string,
});
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client("553415727551-mfmp25am0vcqnv31ojoakltj3atnh55r.apps.googleusercontent.com");

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "553415727551-mfmp25am0vcqnv31ojoakltj3atnh55r.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }
    
    // map to user object structure expected by routes
    req.user = {
      uid: payload.sub,
      email: payload.email
    };
    next();
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

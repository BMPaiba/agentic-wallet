import { Request, Response, NextFunction } from 'express';

// Request logger middleware
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    const emoji = statusCode >= 400 ? '❌' : '✅';
    console.log(
      `${emoji} ${method} ${originalUrl} - ${statusCode} - ${duration}ms`
    );
  });

  next();
}

// CORS configuration
export const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

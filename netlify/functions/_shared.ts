import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// CORS headers for all functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://drive-mode-ai.netlify.app' 
    : '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle preflight requests
export const handleCORS = (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }
  return null;
};

// Error response helper
export const errorResponse = (statusCode: number, message: string) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({ error: message }),
});

// Success response helper
export const successResponse = (data: any) => ({
  statusCode: 200,
  headers: corsHeaders,
  body: JSON.stringify(data),
});

// Get user ID from headers
export const getUserId = (event: HandlerEvent): string => {
  return event.headers['x-user-id'] || 'temp-user-id';
};

// Parse JSON body safely
export const parseBody = (event: HandlerEvent) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    throw new Error('Invalid JSON body');
  }
};

import jwt from 'jsonwebtoken';

/**
 * Generate a JSON Web Token
 * @param id The user ID to encode in the token
 * @returns The generated token
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export default generateToken; 
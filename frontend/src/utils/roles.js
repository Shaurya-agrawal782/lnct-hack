/**
 * Helper utilities for role-based authorization checks in the frontend.
 */

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

export const isResponder = (user) => {
  return user && user.role === 'responder';
};

export const isCitizen = (user) => {
  return user && user.role === 'citizen';
};

export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

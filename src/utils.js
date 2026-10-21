// Resolves a path under public/ against the site's base URL.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

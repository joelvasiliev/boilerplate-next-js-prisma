'use server';
export function getUrl(path: string) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const normalizedPath = path && !path.startsWith('/') ? `/${path}` : path || ''
    return `${baseUrl}${normalizedPath}`
}
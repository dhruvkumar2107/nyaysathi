export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/client/dashboard/', '/lawyer/dashboard/'],
        },
        sitemap: 'https://nyaynow.com/sitemap.xml',
    }
}

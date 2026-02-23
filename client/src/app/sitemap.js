async function getLawyers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    // Skip fetching during build if on localhost (backend won't be there)
    if (typeof window === 'undefined' && apiUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
        return []
    }
    try {
        const res = await fetch(`${apiUrl}/api/users?role=lawyer`, { cache: 'no-store' })
        if (!res.ok) return []
        return res.json()
    } catch (error) {
        // Only log error if not in a known build-time failure scenario
        if (!apiUrl.includes('localhost')) {
            console.error("Error fetching lawyers for sitemap:", error)
        }
        return []
    }
}

export default async function sitemap() {
    const baseUrl = 'https://nyaynow.com'
    const lawyers = await getLawyers()

    const lawyerUrls = lawyers.map((lawyer) => ({
        url: `${baseUrl}/lawyer/${lawyer._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/marketplace`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/legal-sos`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    return [...staticUrls, ...lawyerUrls]
}

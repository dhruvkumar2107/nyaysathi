async function getLawyers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    try {
        const res = await fetch(`${apiUrl}/api/users?role=lawyer`)
        if (!res.ok) return []
        return res.json()
    } catch (error) {
        console.error("Error fetching lawyers for sitemap:", error)
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

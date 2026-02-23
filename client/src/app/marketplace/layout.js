export const metadata = {
    title: 'Lawyer Marketplace | Find Top Legal Experts - NyayNow',
    description: 'Browse and connect with verified lawyers across India on NyayNow. Filter by specialization, location, and experience to find the right legal expert for your case.',
    openGraph: {
        title: 'NyayNow Lawyer Marketplace',
        description: 'Connect with India\'s top 1% of legal minds. Verified, vetted, and ready to represent you.',
        url: 'https://nyaynow.com/marketplace',
        type: 'website',
        images: ['/logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NyayNow Lawyer Marketplace',
        description: 'Find verified legal experts across India.',
        images: ['/logo.png'],
    }
}

export default function MarketplaceLayout({ children }) {
    return <>{children}</>
}

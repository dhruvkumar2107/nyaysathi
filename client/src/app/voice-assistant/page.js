import dynamic from 'next/dynamic';

const VoiceAssistant = dynamic(() => import("../../../legacy_ignore/pages/VoiceAssistant"), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#0c1220] flex items-center justify-center text-white">Loading Voice AI...</div>
});

export default function VoiceAssistantPage() {
    return <VoiceAssistant />;
}

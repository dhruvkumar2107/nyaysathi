import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VideoCall() {
    const { id } = useParams();
    const navigate = useNavigate();
    const jitsiContainer = useRef(null);

    useEffect(() => {
        // Load Jitsi script specifically for this component
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = initJitsi;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initJitsi = () => {
        if (!window.JitsiMeetExternalAPI) return;

        const domain = "meet.jit.si";
        const options = {
            roomName: `NyaySathi-${id}`,
            width: "100%",
            height: "100%",
            parentNode: jitsiContainer.current,
            configOverwrite: {
                startWithAudioMuted: true,
                prejoinPageEnabled: false,
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                    'security'
                ],
            },
            userInfo: {
                displayName: "User"
            }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        api.addEventListeners({
            videoConferenceLeft: () => {
                navigate(-1); // Go back when finished
                api.dispose();
            },
        });
    };

    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col pt-20">
            <div ref={jitsiContainer} className="flex-1 w-full h-full" />
        </div>
    );
}

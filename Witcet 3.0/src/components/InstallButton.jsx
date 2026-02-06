import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            // Log install to analytics
            console.log('INSTALL: Success');
            setIsInstallable(false);
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    if (isInstalled) {
        return null;
        // Or return a "Open App" button if you want, but usually we hide it.
    }

    if (!isInstallable) {
        return null;
    }

    return (
        <Button
            variant="primary"
            className="rounded-pill px-3 ms-2 d-flex align-items-center gap-2 header_btn"
            onClick={handleInstallClick}
        >
            <i className="fa-solid fa-download"></i>
            <span>Install App</span>
        </Button>
    );
};

export default InstallButton;

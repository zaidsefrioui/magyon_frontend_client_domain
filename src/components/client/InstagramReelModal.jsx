import { Modal } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { Spin } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const InstagramReelModal = ({ visible, onCancel, reelUrl }) => {
    const [loading, setLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);
    const scriptRef = useRef(null);
    const timeoutRef = useRef(null);

    // Format the URL correctly
    const formattedUrl = reelUrl?.startsWith('http')
        ? reelUrl
        : `https://www.instagram.com/${reelUrl}`;

    useEffect(() => {
        if (visible && reelUrl) {
            setLoading(true);
            setIframeKey(prev => prev + 1); // Force iframe reload

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Remove previous script if exists
            if (scriptRef.current) {
                document.body.removeChild(scriptRef.current);
                scriptRef.current = null;
            }

            // Create new script
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => {
                // Sometimes the embed doesn't load immediately
                timeoutRef.current = setTimeout(() => setLoading(false), 1000);
            };

            document.body.appendChild(script);
            scriptRef.current = script;

            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [visible, reelUrl]);

    useEffect(() => {
        return () => {
            // Cleanup when component unmounts
            if (scriptRef.current) {
                document.body.removeChild(scriptRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!reelUrl) return null;

    return (
        <Modal
            title="Instagram Reel"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={540}
            centered
            destroyOnClose
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '540px',
                        width: '100%'
                    }}>
                        <Spin
                            indicator={
                                <PlayCircleOutlined
                                    style={{
                                        fontSize: '48px',
                                        color: '#E1306C',
                                        animation: 'spin 1s linear infinite'
                                    }}
                                />
                            }
                        />
                        <div style={{ marginTop: 16, color: '#555' }}>
                            Loading Instagram Reel...
                        </div>
                    </div>
                ) : (
                    <iframe
                        key={iframeKey}
                        src={`https://www.instagram.com/p/${reelUrl.split('/').filter(Boolean).pop()}/embed`}
                        width="540"
                        height="700"
                        frameBorder="0"
                        scrolling="no"
                        allowTransparency="true"
                        style={{
                            border: 'none',
                            overflow: 'hidden',
                            maxWidth: '540px',
                            minWidth: '326px',
                            width: '99.375%'
                        }}
                    />
                )}
            </div>

            <style>
                {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
            </style>
        </Modal>
    );
};

export default InstagramReelModal;
import { useEffect, useRef } from "react";
import { Modal } from "antd";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScannerModal({ open, onClose, onDetected }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);
  const detectedRef = useRef(false);

  // 🔹 Beep sesi
  const playBeep = () => {
    try {
      const audio = new Audio("/BarcodeScanner.mp3");
      audio.play().catch(() => {});
    } catch {}
  };

  useEffect(() => {
    if (!open) return;

    if (readerRef.current) {
      try { readerRef.current.reset(); } catch {}
      readerRef.current = null;
    }

    detectedRef.current = false;

    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "");
        videoRef.current.setAttribute("autoplay", "");
        videoRef.current.muted = true;
        await videoRef.current.play();

        const result = await codeReader.decodeOnceFromVideoElement(videoRef.current);

        if (result && !detectedRef.current) {
          detectedRef.current = true;
          const code = result.getText();

          playBeep();
          onDetected(code);

          try { codeReader.reset(); } catch {}
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
          }

          setTimeout(() => onClose(), 0);
        }

      } catch (err) {
        console.error("Kamera açılamadı:", err);
      }
    };

    const timeout = setTimeout(startCamera, 50);

    return () => {
      clearTimeout(timeout);
      try {
        readerRef.current?.reset();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
      } catch {}
    };
  }, [open, onClose, onDetected]);

  return (
    <Modal
      open={open}
      onCancel={() => {
        try {
          readerRef.current?.reset();
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
          }
        } catch {}
        onClose();
      }}
      footer={null}
      centered
      destroyOnClose
      title="Scan Barcode"
    >
      {/* 🔲 Video + Overlay */}
      <div style={{ position: "relative", width: "100%" }}>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            minHeight:"250px",
            borderRadius: 8,
            backgroundColor: "#000"
          }}
        />

        {/* 🔲 Beyaz Kare */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "220px",
            height: "220px",
            transform: "translate(-50%, -50%)",
            border: "3px solid white",
            borderRadius: "12px",
            boxShadow: "0 0 0 2000px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        />
      </div>
    </Modal>
  );
}

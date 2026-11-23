'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FrameShapeType, FRAME_MATERIALS, LENS_TINTS } from '../3d/MaterialsAndTints';
import { getDefaultTryOnImage } from '../../lib/try-on-assets';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import {
  Camera,
  X,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  Upload,
  User,
  ShoppingBag,
  Share2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: any;
  initialShape?: FrameShapeType;
  initialMaterial?: string;
  initialLens?: string;
}

const SAMPLE_MODELS = [
  {
    id: 'model-1',
    label: 'Oval Face (Male)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    defaultX: 0,
    defaultY: -15,
    defaultScale: 1.0,
  },
  {
    id: 'model-2',
    label: 'Round Face (Female)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    defaultX: 0,
    defaultY: -10,
    defaultScale: 0.95,
  },
  {
    id: 'model-3',
    label: 'Square Face (Male)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    defaultX: 0,
    defaultY: -20,
    defaultScale: 1.05,
  },
];

const DEFAULT_STORE_PRODUCTS = [
  {
    id: 'prd-wayfarer-1',
    name: 'Wayfarer Bold Acetate',
    basePrice: 2999,
    frameShape: 'wayfarer',
    frameMaterial: 'acetate',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
  {
    id: 'prd-aviator-1',
    name: 'Aviator SkyMaster Titanium',
    basePrice: 3499,
    frameShape: 'aviator',
    frameMaterial: 'gold-metal',
    images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
  {
    id: 'prd-clubmaster-1',
    name: 'Clubmaster Retro Browline',
    basePrice: 3699,
    frameShape: 'clubmaster',
    frameMaterial: 'tortoiseshell',
    images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
  {
    id: 'prd-round-1',
    name: 'Round Classic Intellectual',
    basePrice: 3199,
    frameShape: 'round',
    frameMaterial: 'silver-metal',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
  {
    id: 'prd-hex-1',
    name: 'Hexagonal Geometric Gold',
    basePrice: 3599,
    frameShape: 'hexagonal',
    frameMaterial: 'gold-metal',
    images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
  {
    id: 'prd-cateye-1',
    name: 'Cat-Eye Couture Siren',
    basePrice: 3899,
    frameShape: 'cat-eye',
    frameMaterial: 'acetate',
    images: ['https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
  {
    id: 'prd-rimless-1',
    name: 'Rimless FeatherLight Titanium',
    basePrice: 4299,
    frameShape: 'rimless',
    frameMaterial: 'titanium',
    images: ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=600&q=80'],
    tryOnImage: null,
  },
];

export function VirtualTryOnModal({
  isOpen,
  onClose,
  initialProduct,
  initialShape = 'wayfarer',
  initialMaterial = 'acetate-black',
  initialLens = 'polarized-uv400',
}: VirtualTryOnModalProps) {
  // Mode: 'camera' (Live AR) | 'selfie' (Photo Studio)
  const [activeTab, setActiveTab] = useState<'camera' | 'selfie'>('camera');

  // Active Selected Product
  const [selectedProduct, setSelectedProduct] = useState<any>(initialProduct || DEFAULT_STORE_PRODUCTS[0]);
  const [catalogProducts, setCatalogProducts] = useState<any[]>(DEFAULT_STORE_PRODUCTS);

  // Position & Calibration Controls
  const [scale, setScale] = useState<number>(1.0); // 0.6 to 1.5
  const [verticalOffset, setVerticalOffset] = useState<number>(0); // -100 to +100 px
  const [horizontalOffset, setHorizontalOffset] = useState<number>(0); // -100 to +100 px
  const [rotation, setRotation] = useState<number>(0); // -25 to +25 deg
  const [showSliders, setShowSliders] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false); // Toggle to compare bare face

  // Dragging state for direct touch / mouse positioning
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startH: number; startV: number }>({
    x: 0,
    y: 0,
    startH: 0,
    startV: 0,
  });

  // Camera & Video State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Selfie / Photo State
  const [userSelfieUrl, setUserSelfieUrl] = useState<string | null>(null);
  const [selectedSampleModel, setSelectedSampleModel] = useState<string | null>(null);

  // Download / Share State
  const [downloading, setDownloading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addItem } = useCart();
  const router = useRouter();

  // Load all products from backend
  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          setCatalogProducts(data.products);
          if (initialProduct) {
            const match = data.products.find((p: any) => p.id === initialProduct.id || p.slug === initialProduct.slug);
            if (match) setSelectedProduct(match);
          }
        }
      })
      .catch(() => {});
  }, [initialProduct]);

  // Sync initial product / shape props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        setSelectedProduct(initialProduct);
      } else {
        const match = catalogProducts.find((p) => p.frameShape === initialShape);
        if (match) setSelectedProduct(match);
      }
      // Start live camera by default
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, initialProduct, initialShape]);

  // Camera Initialization
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCameraActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraActive(false);
      setCameraError(err.message || 'Camera permission denied.');
      // Switch automatically to Selfie Studio with sample model
      setActiveTab('selfie');
      setSelectedSampleModel(SAMPLE_MODELS[0].url);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Switch to frame
  const handleSelectProduct = (prod: any) => {
    setSelectedProduct(prod);
  };

  // Reset Adjustments
  const handleResetAdjustments = () => {
    setScale(1.0);
    setVerticalOffset(0);
    setHorizontalOffset(0);
    setRotation(0);
  };

  // Snap Snapshot from Live Camera -> Move to Selfie Studio
  const handleSnapSelfie = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const snapshotData = canvas.toDataURL('image/jpeg', 0.95);
    setUserSelfieUrl(snapshotData);
    setSelectedSampleModel(null);
    setActiveTab('selfie');
    stopCamera();
  };

  // Upload Local Selfie from phone/PC gallery
  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUserSelfieUrl(result);
        setSelectedSampleModel(null);
        setActiveTab('selfie');
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Mouse & Touch Drag Handlers for direct glasses repositioning
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      startH: horizontalOffset,
      startV: verticalOffset,
    };
  };

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      setHorizontalOffset(Math.max(-120, Math.min(120, dragStartRef.current.startH + dx)));
      setVerticalOffset(Math.max(-120, Math.min(120, dragStartRef.current.startV + dy)));
    },
    [isDragging]
  );

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove]);

  // Determine which try-on graphic to render
  const tryOnGraphicSrc =
    selectedProduct.tryOnImage || getDefaultTryOnImage(selectedProduct.frameShape || 'wayfarer');

  // Composite Canvas & Download Look
  const handleDownloadLook = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background: User Selfie, Sample Model, or Video snapshot
      let baseImgSrc = userSelfieUrl || selectedSampleModel;
      if (!baseImgSrc && videoRef.current) {
        // Grab instant frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoRef.current.videoWidth || 720;
        tempCanvas.height = videoRef.current.videoHeight || 720;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          if (facingMode === 'user') {
            tempCtx.translate(tempCanvas.width, 0);
            tempCtx.scale(-1, 1);
          }
          tempCtx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
          baseImgSrc = tempCanvas.toDataURL('image/jpeg');
        }
      }

      if (baseImgSrc) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          bgImg.onload = resolve;
          bgImg.onerror = resolve;
          bgImg.src = baseImgSrc!;
        });

        // Cover crop into 1080x1350
        const scaleFactor = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
        const nw = bgImg.width * scaleFactor;
        const nh = bgImg.height * scaleFactor;
        const nx = (canvas.width - nw) / 2;
        const ny = (canvas.height - nh) / 2;
        ctx.drawImage(bgImg, nx, ny, nw, nh);
      } else {
        // Fallback dark gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Draw Eyewear Overlay with scale & rotation
      const glassesImg = new Image();
      glassesImg.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        glassesImg.onload = resolve;
        glassesImg.onerror = resolve;
        glassesImg.src = tryOnGraphicSrc;
      });

      const glassesWidth = 580 * scale;
      const glassesHeight = glassesWidth * 0.42;
      const gx = canvas.width / 2 + horizontalOffset * 1.6;
      const gy = canvas.height * 0.42 + verticalOffset * 1.6;

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(glassesImg, -glassesWidth / 2, -glassesHeight / 2, glassesWidth, glassesHeight);
      ctx.restore();

      // 3. Add Store Branding & Watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, canvas.height - 180, canvas.width, 180);

      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`SPECTRA.PK · ${selectedProduct.name}`, 40, canvas.height - 110);

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(
        `Fitted via AR Virtual Try-On · Rs. ${selectedProduct.basePrice?.toLocaleString()} (Cash on Delivery)`,
        40,
        canvas.height - 70
      );

      // Download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `spectra-try-on-${selectedProduct.slug || 'eyewear'}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.warn(e);
    } finally {
      setDownloading(false);
    }
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Check out how this ${selectedProduct.name} looks on me from Spectra Eyewear! What do you think? https://spectra.pk/product/${selectedProduct.slug || 'eyewear'}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // 1-Click Buy Now (COD Checkout)
  const handleBuyThisLook = () => {
    addItem({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      frameShape: selectedProduct.frameShape || 'wayfarer',
      frameMaterial: selectedProduct.frameMaterial || 'acetate',
      lensTint: 'Polarized UV400',
      frameColor: '#111111',
      price: selectedProduct.basePrice || 2999,
      quantity: 1,
      image: selectedProduct.images?.[0],
    });

    handleClose();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-strong relative w-full max-w-5xl h-full sm:h-auto sm:max-h-[96vh] rounded-none sm:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl flex flex-col bg-slate-950/90 text-white">
        {/* Shutter Flash Animation */}
        {shutterFlash && <div className="absolute inset-0 z-50 bg-white animate-fade-out pointer-events-none" />}

        {/* 1. TOP HEADER BAR */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-black/40 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-accent to-pink-500 text-white flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-tight">AR Virtual Try-On</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  2D Picture Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live Camera Snapchat Filter · Snap or Upload Selfie · Instant Frame Swap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Tabs */}
            <div className="flex rounded-full bg-white/10 p-1 border border-white/10">
              <button
                onClick={() => {
                  setActiveTab('camera');
                  startCamera();
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'camera' ? 'bg-accent text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Camera</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('selfie');
                  stopCamera();
                  if (!userSelfieUrl && !selectedSampleModel) {
                    setSelectedSampleModel(SAMPLE_MODELS[0].url);
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'selfie' ? 'bg-accent text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Selfie Studio</span>
              </button>
            </div>

            {/* Slider Toggle */}
            <button
              onClick={() => setShowSliders(!showSliders)}
              className={`btn h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/10 ${
                showSliders ? 'bg-accent text-white' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
              title="Calibrate Fit"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Adjust Fit</span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500/80 text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. MAIN DISPLAY STAGE */}
        <div
          ref={containerRef}
          className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center min-h-[350px] sm:min-h-[460px] max-h-[58vh]"
        >
          {/* A. Live Camera Mode */}
          {activeTab === 'camera' && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {cameraError ? (
                <div className="p-6 text-center max-w-sm space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Camera Access Required</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button onClick={() => startCamera()} className="btn btn-primary h-9 px-4 text-xs font-bold">
                      Retry Camera
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('selfie');
                        setSelectedSampleModel(SAMPLE_MODELS[0].url);
                      }}
                      className="btn btn-ghost h-9 px-4 text-xs font-bold text-white"
                    >
                      Use Selfie Studio Instead
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Smart Alignment Guide Watermark */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-64 sm:w-72 h-80 rounded-[50px] border border-dashed border-white/30 flex flex-col items-center justify-start pt-8">
                      <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-slate-300 font-semibold flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>Align Face in Oval</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Camera Controls: Snap Snapshot + Flip Camera */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button
                      onClick={toggleCameraFacing}
                      className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90"
                      title="Flip Camera"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shutter Snap Button */}
                  <div className="absolute bottom-4 z-20 flex items-center justify-center gap-3">
                    <button
                      onClick={handleSnapSelfie}
                      className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/30 transform active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📸 Snap Selfie to Try All Frames</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* B. Selfie Studio Mode */}
          {activeTab === 'selfie' && (
            <div className="relative w-full h-full flex items-center justify-center bg-black/95">
              {userSelfieUrl ? (
                <img
                  src={userSelfieUrl}
                  alt="User Selfie"
                  className="w-full h-full object-contain max-h-[58vh]"
                />
              ) : selectedSampleModel ? (
                <img
                  src={selectedSampleModel}
                  alt="Sample Model"
                  className="w-full h-full object-contain max-h-[58vh]"
                />
              ) : (
                <div className="p-6 text-center space-y-4">
                  <User className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Snap a selfie or upload a photo to preview glasses</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary h-10 px-5 text-xs font-bold flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Front Photo</span>
                  </button>
                </div>
              )}

              {/* Top Controls inside Selfie Studio */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>Upload My Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  className="hidden"
                />

                <button
                  onClick={() => {
                    setActiveTab('camera');
                    startCamera();
                  }}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-md"
                >
                  <Camera className="w-3.5 h-3.5 text-accent" />
                  <span>Take Live Snapshot</span>
                </button>
              </div>

              {/* Sample Face Models Selector */}
              <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
                {SAMPLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setUserSelfieUrl(null);
                      setSelectedSampleModel(model.url);
                    }}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                      selectedSampleModel === model.url ? 'border-accent scale-110' : 'border-transparent opacity-60'
                    }`}
                    title={model.label}
                  >
                    <img src={model.url} alt={model.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* C. The Superimposed 2D Eyewear Graphic Overlay */}
          {!showBeforeAfter && (
            <div
              onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                if (e.touches.length > 0) {
                  handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              style={{
                position: 'absolute',
                top: `calc(40% + ${verticalOffset}px)`,
                left: `calc(50% + ${horizontalOffset}px)`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: 25,
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                width: '320px',
                height: '135px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="group select-none"
              title="Drag to reposition on nose bridge"
            >
              <img
                src={tryOnGraphicSrc}
                alt={selectedProduct.name}
                draggable={false}
                className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] pointer-events-none"
              />

              {/* Micro Drag Indicator Handles (Subtle hover ring) */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-accent/40 pointer-events-none transition-colors" />
            </div>
          )}

          {/* Quick Fit Hint */}
          <div className="absolute bottom-2 left-3 z-20 pointer-events-none">
            <span className="text-[10px] text-slate-400 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
              💡 Drag glasses directly to adjust bridge position
            </span>
          </div>

          {/* Before/After Toggle Floating Button */}
          <button
            onMouseDown={() => setShowBeforeAfter(true)}
            onMouseUp={() => setShowBeforeAfter(false)}
            onTouchStart={() => setShowBeforeAfter(true)}
            onTouchEnd={() => setShowBeforeAfter(false)}
            className="absolute bottom-2 right-3 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-slate-200 border border-white/20 active:bg-accent active:text-white transition-colors"
          >
            Hold for Before / After
          </button>
        </div>

        {/* 3. CALIBRATION SLIDERS DRAWER (Expandable) */}
        {showSliders && (
          <div className="p-3 bg-black/70 border-t border-white/10 animate-fade-in text-xs space-y-2 z-30">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Micro-Calibration Controls
              </span>
              <button
                onClick={handleResetAdjustments}
                className="text-[11px] text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default Fit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Width / Scale */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Frame Size / Scale</span>
                  <span className="font-mono text-white">{(scale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.02"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              {/* Vertical Bridge Height */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Bridge Height (Up / Down)</span>
                  <span className="font-mono text-white">{verticalOffset}px</span>
                </div>
                <input
                  type="range"
                  min="-70"
                  max="70"
                  step="2"
                  value={verticalOffset}
                  onChange={(e) => setVerticalOffset(parseInt(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              {/* Tilt Rotation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Angle Tilt</span>
                  <span className="font-mono text-white">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. UNIVERSAL FRAME SELECTION TRAY (1-Tap Swap) */}
        <div className="p-3 bg-slate-950 border-t border-white/10 z-30 space-y-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Switch Frame on Your Face</span>
              <span className="text-accent">({catalogProducts.length} Models)</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">
              Current: {selectedProduct.name} · Rs. {selectedProduct.basePrice?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {catalogProducts.map((p) => {
              const isSelected = selectedProduct.id === p.id || selectedProduct.name === p.name;
              const thumbSrc =
                p.tryOnImage || (p.images && p.images[0]) || getDefaultTryOnImage(p.frameShape || 'wayfarer');

              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className={`flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'bg-accent/20 border-accent text-white shadow-lg shadow-accent/20 scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-12 h-9 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center p-1 border border-white/5">
                    <img src={thumbSrc} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold leading-tight truncate max-w-[110px]">
                      {p.name}
                    </span>
                    <span className="block text-[10px] text-emerald-400 font-bold">
                      Rs. {p.basePrice?.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. ACTION FOOTER & DIRECT CASH ON DELIVERY ORDER */}
        <div className="p-3.5 sm:p-4 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadLook}
              disabled={downloading}
              className="btn btn-ghost h-11 px-4 text-xs font-bold text-slate-200 border border-white/15 rounded-2xl flex items-center gap-2 hover:bg-white/10"
              title="Download High-Res Snapshot with Frame"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>{downloading ? 'Rendering...' : 'Save My Look'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="btn btn-ghost h-11 px-4 text-xs font-bold text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center gap-2 hover:bg-emerald-500/10"
              title="Share with Family on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Ask on WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              onClick={handleBuyThisLook}
              className="btn btn-primary h-12 px-6 text-xs sm:text-sm font-black flex-1 sm:flex-initial flex items-center justify-center gap-2 shadow-xl shadow-accent/30 rounded-2xl group hover:scale-[1.02] transition-transform"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                ⚡ Order {selectedProduct.name} - Rs. {selectedProduct.basePrice?.toLocaleString()} (COD)
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

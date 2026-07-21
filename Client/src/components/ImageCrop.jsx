import React, { useState } from 'react';
import { circIn, motion } from 'motion/react';
import { ZoomIn, ZoomOut, Check, X, Move } from 'lucide-react';

export default function ImageCrop({ imageSrc, onCancel, onCropComplete, isDark }) {
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Dragging / Panning
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Crop logic
    const handleSaveCrop = () => {
        const canvas = document.createElement('canvas');
        const cropSize = 300;
        canvas.width = cropSize;
        canvas.height = cropSize;
        const ctx = canvas.getContext('2d');

        const img = new Image();

        img.onload = () => {
            // Crop mask
            ctx.beginPath();
            ctx.rect(0, 0, cropSize, cropSize);
            ctx.clip();

            // Calculate scale & center position 
            const baseScale = Math.min(cropSize / img.width, cropSize / img.height);
            let renderW = img.width * baseScale * zoom;
            let renderH = img.height * baseScale * zoom;

            const drawX = cropSize / 2 - renderW / 2 + offset.x;
            const drawY = cropSize / 2 - renderH / 2 + offset.y;

            ctx.drawImage(img, drawX, drawY, renderW, renderH);

            // Return crop image data
            const croppedBase64 = canvas.toDataURL('image/png');
            onCropComplete(croppedBase64);
        };

        img.src = imageSrc;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
                    isDark
                        ? "bg-[#1E1E1F] border-zinc-800 text-white"
                        : "bg-white border-zinc-200 text-zinc-900"
                }`}
            >
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-base font-extrabold flex items-center gap-2'>
                        <Move className='w-4 h-4 text-purple-400' />
                        Reposition & Crop Photo
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        className='p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer'
                    >
                        <X className='w-8 h-8' />
                    </button>
                </div>

                <div 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className='relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-4 border-purple-500/80 shadow-inner 
                    cursor-grab active:cursor-grabbing bg-black/20 flex items-center justify-center'
                >
                    <img
                        src={imageSrc}
                        alt='Crop Preview'
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                        }}
                        className='max-w-full max-h-full object-contain pointer-events-none select-none'
                    />
                </div>

                <p className='text-[11px] text-center text-zinc-400 mt-3 font-medium'>
                    💡 Click & Drag to reposition • Use slider to zoom  
                </p>

                {/* Zoom control slider */}
                <div className='flex items-center gap-3 my-5 px-2'>
                    <ZoomOut className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                        type='range'
                        min='0.5'
                        max='3'
                        step='0.05'
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className='w-full accent-purple-500 cursor-pointer h-1.5 bg-zinc-700 rounded-lg'
                    />
                    <ZoomIn className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>

                {/* Modal action buttons */}
                <div className='flex gap-3 pt-2'>
                    <button
                        type='button'
                        onClick={onCancel}
                        className='flex-1 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 font-bold text-xs transition-all cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSaveCrop}
                        className='flex-1 py-2.5 argubot-cta-btn font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer'
                    >
                        <Check className='w-4 h-4' />
                        <span>
                            Apply Crop
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
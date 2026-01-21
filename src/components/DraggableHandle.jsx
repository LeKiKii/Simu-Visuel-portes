import React, { useEffect, useState } from 'react';

export default function DraggableHandle({ x, y, onDrag, color = 'blue' }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      onDrag(e);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, onDrag]);

  return (
    <div
      onPointerDown={(e) => {
        e.stopPropagation(); // Prevent triggering parent drag events if any
        setIsDragging(true);
      }}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)', // Center the handle on coordinates
        touchAction: 'none' // Important for touch devices
      }}
      className={`absolute w-6 h-6 rounded-full border-2 border-white cursor-move shadow-md z-50 flex items-center justify-center
        ${isDragging ? 'scale-125' : 'hover:scale-110'}
        transition-transform duration-75
      `}
    >
      <div className={`w-3 h-3 rounded-full ${color === 'blue' ? 'bg-blue-600' : 'bg-white'}`}></div>
    </div>
  );
}

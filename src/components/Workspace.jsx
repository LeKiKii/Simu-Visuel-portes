import React, { useState, useRef, useEffect } from 'react';
import DraggableHandle from './DraggableHandle';
import { getPerspectiveTransform } from '../utils/math';
import { Eye, EyeOff } from 'lucide-react';

const DEFAULT_POINTS = [
  { x: 100, y: 100 }, // TL
  { x: 300, y: 100 }, // TR
  { x: 300, y: 500 }, // BR
  { x: 100, y: 500 }, // BL
];

export default function Workspace({ backgroundUrl, doorUrl }) {
  const containerRef = useRef(null);
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [doorDimensions, setDoorDimensions] = useState({ w: 0, h: 0 });
  const [transformStyle, setTransformStyle] = useState('');
  const [showControls, setShowControls] = useState(true);
  
  // State for dragging the whole shape
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const [lastMousePos, setLastMousePos] = useState(null);

  // Reset points when a new door is selected
  useEffect(() => {
    if (doorUrl) {
      // We start with a default rectangle centered-ish
      // Ideally we center it in the view, but fixed is fine for MVP
      setPoints([
        { x: 150, y: 150 },
        { x: 350, y: 150 },
        { x: 350, y: 550 },
        { x: 150, y: 550 },
      ]);
    }
  }, [doorUrl]);

  const handleDoorLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setDoorDimensions({ w: naturalWidth, h: naturalHeight });
  };

  // Recalculate transform whenever points or dimensions change
  useEffect(() => {
    if (doorDimensions.w === 0 || doorDimensions.h === 0) return;

    // Source points: The corners of the original image (0,0) to (w,h)
    const src = [
      [0, 0],
      [doorDimensions.w, 0],
      [doorDimensions.w, doorDimensions.h],
      [0, doorDimensions.h]
    ];

    // Destination points: The current coordinates of our handles
    const dst = points.map(p => [p.x, p.y]);

    try {
      const matrix = getPerspectiveTransform(src, dst);
      setTransformStyle(matrix);
    } catch (err) {
      console.error("Matrix calculation failed", err);
    }
  }, [points, doorDimensions]);

  // Handle global mouse move/up for shape dragging
  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (!isDraggingShape || !lastMousePos) return;
      
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      
      setPoints(prev => prev.map(p => ({ x: p.x + dx, y: p.y + dy })));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleGlobalUp = () => {
      setIsDraggingShape(false);
      setLastMousePos(null);
    };

    if (isDraggingShape) {
      window.addEventListener('pointermove', handleGlobalMove);
      window.addEventListener('pointerup', handleGlobalUp);
    }
    
    return () => {
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('pointerup', handleGlobalUp);
    };
  }, [isDraggingShape, lastMousePos]);

  const handleDrag = (index, e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = { x, y };
      return newPoints;
    });
  };

  const handleShapeDown = (e) => {
    e.stopPropagation();
    setIsDraggingShape(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center">
      {/* Control Toggle */}
      {backgroundUrl && doorUrl && (
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white text-gray-700 transition-all flex items-center gap-2"
          title={showControls ? "Masquer les contrôles" : "Afficher les contrôles"}
        >
          {showControls ? <EyeOff size={20} /> : <Eye size={20} />}
          <span className="text-sm font-medium">{showControls ? "Masquer" : "Afficher"}</span>
        </button>
      )}

      {/* Container for the workspace */}
      {backgroundUrl ? (
        <div 
          ref={containerRef}
          className="relative shadow-lg select-none"
          style={{ 
            // Constrain max size to view, preserve aspect ratio is automatic with img
            maxWidth: '100%', 
            maxHeight: '100%' 
          }}
        >
          {/* Background Image */}
          <img 
            src={backgroundUrl} 
            alt="Background" 
            className="block max-h-[90vh] max-w-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Overlay Door */}
          {doorUrl && (
            <>
              <img
                src={doorUrl}
                alt="Door"
                onLoad={handleDoorLoad}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transformOrigin: '0 0',
                  transform: transformStyle,
                  pointerEvents: 'none', // Allow clicks to pass through to handles if they overlap? No, handles are z-indexed higher.
                  width: doorDimensions.w,
                  height: doorDimensions.h,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  // If we don't set width/height, the transform might be weird depending on browser layout. 
                  // Usually best to set w/h to natural size and let matrix scale it down.
                  // But we need to hide it initially or standard position?
                  // With matrix3d, it will move to the points.
                  visibility: doorDimensions.w ? 'visible' : 'hidden' 
                }}
              />
              
              {/* Drag Area Overlay */}
              {showControls && (
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
                  style={{ overflow: 'visible' }}
                >
                  <polygon
                    points={points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="rgba(59, 130, 246, 0.1)"
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="2"
                    className="cursor-move pointer-events-auto hover:fill-blue-500/20 transition-colors"
                    onPointerDown={handleShapeDown}
                  />
                </svg>
              )}

              {/* Handles */}
              {showControls && points.map((p, i) => (
                <DraggableHandle
                  key={i}
                  x={p.x}
                  y={p.y}
                  onDrag={(e) => handleDrag(i, e)}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="text-gray-400">
          Veuillez importer une photo pour commencer
        </div>
      )}
    </div>
  );
}

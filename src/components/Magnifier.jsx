import React from 'react';

export default function Magnifier({
  x,
  y,
  imgUrl,
  containerWidth,
  containerHeight,
  zoom = 3,
  size = 120
}) {
  const halfSize = size / 2;

  // Calculate background position
  // We want the point (x, y) of the container to be in the center of the magnifier
  const bgX = halfSize - (x * zoom);
  const bgY = halfSize - (y * zoom);

  // Determine offset to avoid covering the content (e.g. shift up)
  // If we are close to the top edge, shift down instead?
  // For now, consistent top offset is best for muscle memory, unless it goes off screen.
  // Let's stick to a simple upward shift.

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - size/1.5 - 20,
        width: size,
        height: size,
        borderRadius: '50%',
        border: '3px solid white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        zIndex: 60, // Above handles (z-50)
        backgroundColor: 'white',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imgUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${bgX}px ${bgY}px`,
          backgroundSize: `${containerWidth * zoom}px ${containerHeight * zoom}px`,
        }}
      />

      {/* Crosshairs */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/60" style={{ transform: 'translateY(-50%)' }} />
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-red-500/60" style={{ transform: 'translateX(-50%)' }} />
    </div>
  );
}

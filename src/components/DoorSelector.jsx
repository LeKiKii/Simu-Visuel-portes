import React from 'react';
// 1. On importe l'image ici
import porteModerneImg from '../img/00-nativ11-fusion-zilten-porte-entree-miel-noir-9005txt-poignee sugiban-300.jpg';

const SAMPLE_DOORS = [
  // 2. On utilise la variable importée ici (sans guillemets)
  { id: 1, name: "Porte Moderne", src: porteModerneImg },
  { id: 2, name: "Porte Classique", src: "https://placehold.co/200x400/A0522D/FFF?text=Porte+2" },
  { id: 3, name: "Porte Vitrée", src: "https://placehold.co/200x400/CD853F/FFF?text=Porte+3" },
];

export default function DoorSelector({ onSelect, selectedDoorId }) {
  // ... le reste ne change pas ...
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg text-gray-800">Modèles</h2>
      </div>
      <div className="p-2 space-y-2">
        {SAMPLE_DOORS.map((door) => (
          <div 
            key={door.id}
            onClick={() => onSelect(door)}
            className={`cursor-pointer p-2 rounded-lg border-2 transition-all ${
              selectedDoorId === door.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="aspect-[1/2] w-full bg-gray-100 rounded mb-2 overflow-hidden">
              <img src={door.src} alt={door.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium text-center text-gray-700">{door.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
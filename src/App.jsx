import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import DoorSelector from './components/DoorSelector';
import Workspace from './components/Workspace';
import { Layers } from 'lucide-react';

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white shadow-md z-10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-blue-600 text-white">
          <Layers className="w-6 h-6 mr-3" />
          <h1 className="font-bold text-lg">Menuiserie Viz</h1>
        </div>
        
        {/* Door Selector - Only active if background is loaded (optional restriction, but keeps UI clean) */}
        <DoorSelector 
          onSelect={setSelectedDoor} 
          selectedDoorId={selectedDoor?.id} 
        />
        
        {backgroundUrl && (
          <div className="p-4 border-t border-gray-200">
             <button 
               onClick={() => {
                 if(window.confirm("Voulez-vous changer la photo de fond ?")) {
                   setBackgroundUrl(null);
                   setSelectedDoor(null);
                 }
               }}
               className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium transition-colors"
             >
               Changer la photo
             </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {backgroundUrl ? (
          <Workspace 
            backgroundUrl={backgroundUrl} 
            doorUrl={selectedDoor?.src} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Bienvenue</h2>
              <p className="text-center text-gray-500 mb-8">Commencez par importer une photo de votre façade ou intérieur.</p>
              <ImageUploader onUpload={setBackgroundUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

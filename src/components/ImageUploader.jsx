import React from 'react';
import { Upload } from 'lucide-react';

export default function ImageUploader({ onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
      <label className="cursor-pointer flex flex-col items-center">
        <Upload className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-gray-600 font-medium">Glisser une photo ou cliquer pour importer</span>
        <span className="text-sm text-gray-400 mt-1">Formats supportés: JPG, PNG</span>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

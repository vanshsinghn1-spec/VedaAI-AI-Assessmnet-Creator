'use client';

import { useState, useRef, useCallback } from 'react';
import { File as FileIcon, X, CloudUpload } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({ file, onFileChange }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileChange(files[0]);
      }
    },
    [onFileChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  if (file) {
    return (
      <div className="file-uploaded">
        <span><FileIcon size={20} /></span>
        <span className="file-uploaded-name">{file.name}</span>
        <button
          className="file-uploaded-remove"
          onClick={() => onFileChange(null)}
          type="button"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`file-upload ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="file-upload-icon" style={{ display: 'flex', justifyContent: 'center' }}>
          <CloudUpload size={40} strokeWidth={1.5} />
        </div>
        <div className="file-upload-text">
          Choose a file or drag & drop it here
        </div>
        <div className="file-upload-formats">JPEG, PNG, upto 10MB</div>
        <button
          className="file-upload-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse Files
        </button>
        <div className="file-upload-note">
          Upload images of your preferred document/image
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf,text/plain"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </>
  );
}

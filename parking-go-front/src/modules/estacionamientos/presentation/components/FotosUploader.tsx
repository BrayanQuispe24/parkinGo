import React, { useRef } from 'react';

interface FotosUploaderProps {
  fotos: File[];
  onChange: (fotos: File[]) => void;
  disabled?: boolean;
}

export const FotosUploader: React.FC<FotosUploaderProps> = ({
  fotos,
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    const newFiles = Array.from(e.target.files);
    onChange([...fotos, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFoto = (index: number) => {
    if (disabled) return;
    onChange(fotos.filter((_, i) => i !== index));
  };

  return (
    <div className="fotos-uploader-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      <div
        className="dropzone-box"
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main, #17211B)' }}>
          Haz clic aquí para seleccionar fotografías del estacionamiento
        </p>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted, #64748B)' }}>
          JPG, PNG o WEBP (puedes subir fachada, plazas, accesos y señalética)
        </p>
      </div>

      {fotos.length > 0 && (
        <div className="photos-grid-preview">
          {fotos.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div key={`${file.name}-${idx}`} className="photo-preview-item">
                <img src={previewUrl} alt={`Foto ${idx + 1}`} />
                {!disabled && (
                  <button
                    type="button"
                    className="photo-remove-btn"
                    onClick={() => removeFoto(idx)}
                    title="Eliminar foto"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

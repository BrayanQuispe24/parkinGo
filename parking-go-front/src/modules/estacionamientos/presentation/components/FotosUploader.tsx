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
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            background: '#DCFCE7',
            color: '#006D36',
            border: '1px solid #BBF7D0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            marginBottom: '0.6rem',
          }}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main, #17211B)' }}>
          Haz clic aquí para seleccionar fotografías del estacionamiento
        </p>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.76rem', color: 'var(--text-muted, #64748B)' }}>
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

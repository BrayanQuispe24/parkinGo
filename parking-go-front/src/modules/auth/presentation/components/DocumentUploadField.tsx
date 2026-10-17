// src/modules/auth/presentation/components/DocumentUploadField.tsx
import React, { useRef, useState } from 'react';

interface DocumentUploadFieldProps {
    file: File | null;
    onChange: (file: File | null) => void;
    roleName: string;
    error?: string | null;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
    file,
    onChange,
    roleName,
    error,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const roleTitle = roleName === 'anfitrion' ? 'Anfitrión de Parqueo' : 'Administrador de Parqueo';
    const documentHelp =
        roleName === 'anfitrion'
            ? 'Documento de derecho propietario, contrato de alquiler o acreditación de espacio.'
            : 'Licencia de funcionamiento municipal, NIT o poder de administración.';

    const validateAndSelectFile = (selectedFile: File) => {
        setLocalError(null);

        const isPdf =
            selectedFile.type === 'application/pdf' ||
            selectedFile.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
            setLocalError('El documento debe estar estrictamente en formato PDF (.pdf).');
            return;
        }

        const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
        if (selectedFile.size > maxSizeBytes) {
            setLocalError('El archivo PDF excede el tamaño máximo permitido de 10 MB.');
            return;
        }

        onChange(selectedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndSelectFile(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndSelectFile(files[0]);
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setLocalError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                    Documentación de Respaldo ({roleTitle}) <span className="required-star">*</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#006D36', fontWeight: 600 }}>Solo formato PDF</span>
            </label>

            <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {!file ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: isDragging ? '2px dashed #006D36' : '1.5px dashed #CBD5CE',
                        borderRadius: '10px',
                        padding: '1.25rem 1rem',
                        textAlign: 'center',
                        backgroundColor: isDragging ? '#F0FDF4' : '#F9FAF8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'rgba(0, 109, 54, 0.1)',
                            color: '#006D36',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.6rem auto',
                            fontSize: '1.2rem',
                        }}
                    >
                        <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F2417', marginBottom: '0.2rem' }}>
                        Haz clic aquí para adjuntar tu PDF o arrástralo
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#66736B', maxWidth: '380px', margin: '0 auto', lineHeight: '1.35' }}>
                        {documentHelp}
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        border: '1.5px solid #22C55E',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#F0FDF4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#FEE2E2',
                                color: '#DC2626',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                flexShrink: 0,
                            }}
                        >
                            <i className="fa-solid fa-file-pdf"></i>
                        </div>
                        <div style={{ overflow: 'hidden', textAlign: 'left' }}>
                            <div
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: '#0F2417',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                title={file.name}
                            >
                                {file.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                                {formatFileSize(file.size)} • PDF listo para revisión
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        title="Quitar archivo"
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '6px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748B',
                            flexShrink: 0,
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}

            {(localError || error) && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-circle-exclamation"></i> {localError || error}
                </div>
            )}
        </div>
    );
};

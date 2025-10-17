import React, { type JSX, useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Image } from "lucide-react";
import styles from "./form-file-upload.module.css";

type ExistingFile = {
    id: string;
    fileName: string;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
    isPrimary: boolean;
    dataUrl?: string | null;
};

interface FormFileUploadProps {
    label: string;
    value?: File[] | null;
    onChange: (files: File[] | null) => void;
    existingFiles?: Array<ExistingFile | null> | null;
    onRemoveExisting?: (fileId: string) => void;
    error?: string;
    accept?: string;
    maxSizeMB?: number;
    required?: boolean;
    multiple?: boolean;
}

export default function FormFileUpload({ label, value, onChange, existingFiles, onRemoveExisting, error, accept = "image/*", maxSizeMB = 5, required = false, multiple = true }: FormFileUploadProps): JSX.Element {
    const [dragActive, setDragActive] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize previews from existing files
    useEffect(() => {
        if (existingFiles && Array.isArray(existingFiles)) {
            const urls: string[] = [];

            existingFiles.forEach((file) => {
                if (file && file.dataUrl && file.dataUrl.trim() !== "") {
                    urls.push(file.dataUrl);
                }
            });

            if (urls.length > 0) {
                setPreviews(urls);
            }
        }
    }, [existingFiles]);

    const handleFiles = useCallback(
        async (files: FileList) => {
            const validFiles: File[] = [];
            const newPreviews: string[] = [];

            // Validate files and create previews
            for (const file of Array.from(files)) {
                // Check file size
                if (file.size > maxSizeMB * 1024 * 1024) {
                    alert(`File ${file.name} size must be less than ${maxSizeMB}MB`);
                    continue;
                }

                // Check file type
                if (!file.type.startsWith("image/")) {
                    alert(`File ${file.name} must be an image`);
                    continue;
                }

                validFiles.push(file);

                // Create preview synchronously
                const dataUrl = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });
                newPreviews.push(dataUrl);
            }

            if (validFiles.length > 0) {
                const currentFiles = value && Array.isArray(value) ? value : [];
                const allFiles = multiple ? [...currentFiles, ...validFiles] : validFiles;

                // Update both previews and form value
                setPreviews((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews));
                onChange(allFiles);
            }
        },
        [maxSizeMB, onChange, multiple, value]
    );

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        },
        [handleFiles]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();

            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        },
        [handleFiles]
    );

    const handleRemove = useCallback(
        (index?: number) => {
            const existingFilesCount = existingFiles ? existingFiles.filter((f) => f?.dataUrl).length : 0;

            if (index !== undefined) {
                // Remove specific file
                const newPreviews = previews.filter((_, i) => i !== index);
                setPreviews(newPreviews);

                // If removing an existing file (index < existingFilesCount), notify parent
                if (index < existingFilesCount) {
                    const existingFilesList = existingFiles?.filter((f) => f?.dataUrl) || [];
                    const fileToRemove = existingFilesList[index];
                    if (fileToRemove && onRemoveExisting) {
                        onRemoveExisting(fileToRemove.id);
                    }
                } else {
                    // Remove new files that haven't been uploaded yet
                    const newFileIndex = index - existingFilesCount;
                    const currentFiles = value && Array.isArray(value) ? value : [];
                    const newFiles = currentFiles.filter((_, i) => i !== newFileIndex);
                    onChange(newFiles.length > 0 ? newFiles : null);
                }
            } else {
                // Remove all new files, keep existing ones in preview
                const existingPreviews = existingFiles ? existingFiles.filter((f) => f?.dataUrl).map((f) => f!.dataUrl!) : [];
                setPreviews(existingPreviews);
                onChange(null);
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [onChange, previews, value, existingFiles, onRemoveExisting]
    );

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div className={styles.container}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>

            <div className={styles.uploadArea}>
                {previews.length > 0 ? (
                    <div className={styles.previewContainer}>
                        <div className={styles.previewGrid}>
                            {previews.map((preview, index) => (
                                <div key={index} className={styles.imagePreview}>
                                    <img src={preview} alt={`Preview ${index + 1}`} className={styles.previewImage} />
                                    <div className={styles.imageOverlay}>
                                        <button type="button" onClick={() => handleRemove(index)} className={styles.removeButton}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {multiple && (
                            <button type="button" onClick={handleClick} className={styles.addMoreButton}>
                                <Upload size={16} />
                                Add More Images
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={handleClick}>
                        <div className={styles.dropZoneContent}>
                            <div className={styles.iconContainer}>
                                <Image className={styles.uploadIcon} />
                            </div>
                            <p className={styles.dropZoneText}>
                                <span className={styles.dropZoneAction}>Click to upload</span>
                                {" or drag and drop"}
                            </p>
                            <p className={styles.dropZoneHint}>
                                PNG, JPG, GIF up to {maxSizeMB}MB
                                {multiple ? " (multiple files supported)" : ""}
                            </p>
                        </div>
                    </div>
                )}

                <input ref={fileInputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} className={styles.hiddenInput} />
            </div>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

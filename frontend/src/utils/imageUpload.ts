export const compressImageFile = async (file: File, options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}) => {
    const maxWidth = options.maxWidth ?? 1600;
    const maxHeight = options.maxHeight ?? 1600;
    const quality = options.quality ?? 0.82;

    if (!file.type.startsWith('image/')) {
        return file;
    }

    const imageBitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / imageBitmap.width, maxHeight / imageBitmap.height);
    const width = Math.max(1, Math.round(imageBitmap.width * scale));
    const height = Math.max(1, Math.round(imageBitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
        return file;
    }

    context.drawImage(imageBitmap, 0, 0, width, height);
    const mimeType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, mimeType, quality);
    });

    if (!blob) {
        return file;
    }

    const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
    return new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
        type: mimeType,
        lastModified: Date.now(),
    });
};

export const compressImageFiles = async (files: FileList | File[]) => {
    const fileList = Array.isArray(files) ? files : Array.from(files);
    return Promise.all(fileList.map((file) => compressImageFile(file)));
};

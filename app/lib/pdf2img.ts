export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) {
        console.log('[pdf2img] pdfjsLib ya cargado');
        return pdfjsLib;
    }
    if (loadPromise) {
        console.log('[pdf2img] loadPromise ya existe');
        return loadPromise;
    }

    isLoading = true;
    console.log('[pdf2img] Cargando pdfjs-dist/build/pdf.mjs...');
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        console.log('[pdf2img] pdfjs-dist/build/pdf.mjs importado', lib);
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        console.log('[pdf2img] workerSrc seteado a /pdf.worker.min.mjs');
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    }).catch((err) => {
        console.error('[pdf2img] Error importando pdfjs-dist/build/pdf.mjs', err);
        throw err;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log('[pdf2img] Iniciando conversión de PDF a imagen', file);
        const lib = await loadPdfJs();
        console.log('[pdf2img] pdfjsLib cargado', lib);

        console.log('[pdf2img] Tipo de file:', file instanceof File ? 'File' : typeof file, 'size:', file.size);
        const arrayBuffer = await file.arrayBuffer();
        console.log('[pdf2img] arrayBuffer obtenido', arrayBuffer, 'byteLength:', arrayBuffer.byteLength);
        if (arrayBuffer.byteLength > 0) {
            const bytes = new Uint8Array(arrayBuffer.slice(0, 20));
            console.log('[pdf2img] Primeros 20 bytes del arrayBuffer:', bytes);
        } else {
            console.warn('[pdf2img] arrayBuffer está vacío');
        }
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log('[pdf2img] Documento PDF cargado', pdf);
        const page = await pdf.getPage(1);
        console.log('[pdf2img] Página 1 obtenida', page);

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }
        console.log('[pdf2img] Canvas preparado', canvas);

        await page.render({ canvasContext: context!, viewport }).promise;
        console.log('[pdf2img] Renderizado terminado');

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });
                        console.log('[pdf2img] Imagen creada correctamente', imageFile);
                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        console.error('[pdf2img] No se pudo crear el blob de la imagen');
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        console.error('[pdf2img] Error en la conversión', err);
        if (err && typeof err === 'object') {
            try {
                console.error('[pdf2img] Error details:', JSON.stringify(err));
            } catch (e) {
                console.error('[pdf2img] Error details (stringify failed):', err);
            }
        }
        let errorMsg = '';
        if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
            errorMsg = (err as any).message;
        } else {
            errorMsg = String(err);
        }
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${errorMsg}`,
        };
    }
}
import { v2 as cloudinary } from 'cloudinary';

// Lazy config — deferred so dotenv.config() in server.ts runs first
const getCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return cloudinary;
};

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
}

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = 'hero-banners'
): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        const uploadStream = getCloudinary().uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) {
                    // Cloudinary errors are plain objects — convert to proper Error
                    const msg = (error as { message?: string }).message
                        || JSON.stringify(error);
                    reject(new Error(`Cloudinary: ${msg}`));
                } else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                        format: result.format,
                        width: result.width,
                        height: result.height,
                    });
                } else {
                    reject(new Error('Cloudinary upload returned no result'));
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await getCloudinary().uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export default cloudinary;

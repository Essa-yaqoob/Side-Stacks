import { useState } from "react";
import ImagePreview from "./ImagePreview";
import ImageUploader from "./ImageUploader";
import { enhancedImageHandler } from "../utils/enhancedImageUrl.js";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const imageUploader = async (file) => {
    const uploadImageUrl = URL.createObjectURL(file);
    setUploadedImage(uploadImageUrl);
    setLoading(true);

    const enhancedImageData = await enhancedImageHandler(file);
    if (enhancedImageData) {
      setLoading(false);
      setEnhancedImage(enhancedImageData.image);
    }
  };

  return (
    <div className="mt-5 w-full">
      <div>
        <ImageUploader imageUploader={imageUploader} />
      </div>
      <div>
        <ImagePreview
          uploadedImage={uploadedImage}
          enhancedImage={enhancedImage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Home;

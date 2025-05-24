const ImagePreview = ({ uploadedImage, enhancedImage, loading }) => {
  return (
    <div className="mx-auto sm:w-[80%] md:w-[50%] mt-4 p-2 flex gap-3">
      {/* original image */}
      <div className="w-full shadow-2xl rounded-xl bg-white h-[350px] relative flex items-center justify-center">
        <h1 className="absolute top-0 left-0 w-full bg-black text-white p-1 rounded-t-xl text-center">
          Original Image
        </h1>
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Original"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="absolute text-center">No Original Image</span>
        )}
      </div>

      {/* enhanced image */}
      <div className="w-full shadow-2xl rounded-t-xl bg-white h-[350px] relative flex items-center justify-center">
        <h1 className="absolute top-0 left-0 w-full bg-blue-600 text-white p-1 rounded-t-xl text-center">
          Enhanced Image
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : enhancedImage ? (
          <img
            src={enhancedImage}
            alt="Enhanced"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="absolute text-center">No Enhanced Image</span>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;

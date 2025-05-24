const ImageUploader = ({ imageUploader }) => {
  const fileHandler = (e) => {
    const file = e.target?.files[0];
    if (file) {
      imageUploader(file);
    }
  };

  return (
    <div className="shadow-2xl mx-auto sm:w-[80%] md:w-[50%] p-5 rounded-xl">
      <label
        htmlFor="fileInput"
        className="border-2 border-dashed border-black hover:border-blue-600 w-full flex items-center justify-center p-6 cursor-pointer"
      >
        Click and drag to upload your image
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={fileHandler}
        />
      </label>
    </div>
  );
};

export default ImageUploader;

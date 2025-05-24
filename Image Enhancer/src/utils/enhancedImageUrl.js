import axios from "axios";

const MAXIMUM_RETRIES = 20;

export const enhancedImageHandler = async (file) => {
  try {
    const taskId = await uploadImage(file);
    const enhancedImageData = await pollingEnhancedImage(taskId);

    return enhancedImageData;
  } catch (error) {
    console.log(error);
  }
};

const uploadImage = async (file) => {
  try {
    const formData = new FormData(); 
    formData.append("image_file", file);

    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/tasks/visual/scale`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      }
    );

    if (!data?.data?.task_id) {
      throw new Error("Failed to upload image! Task ID not found.");
    }
    return data.data.task_id;
  } catch (error) {
    console.log(error);
  }
};

const fetchEnhancedImage = async (taskId) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/tasks/visual/scale/${taskId}`,
      {
        headers: {
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      }
    );
    if (!data?.data) {
      throw new Error("Failed to fetch enhanced image! Image not found.");
    }

    return data.data;
  } catch (error) {
    console.log(error);
  }
};

const pollingEnhancedImage = async (taskId, retries = 0) => {
  try {
    const result = await fetchEnhancedImage(taskId);

    if (result.state === 4) {
      if (retries >= MAXIMUM_RETRIES) {
        throw new Error("Max retries reached. Please try again later.");
      }

      // wait for 2 second
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return pollingEnhancedImage(taskId, retries + 1);
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

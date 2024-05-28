import axios from "axios";
import { Me } from "../../types/types";

const getMe = async (): Promise<Me> => {
  try {
    const resp = await axios.get('/api/v1/chat/users/me' || "");
    return resp.data;
  } catch (err) {
    // Error Handling
    console.log(err);
    return {
      id: 1,
      firstName: "",
      lastName: "",
      jobTitle: "",
      profileCategory: {
        id: 1,
        profileCategoryName: "",
      },
      profilePhotoUrl: "",
      numberOfConnections: 1,
    };
  }
};

export {
  getMe,
};


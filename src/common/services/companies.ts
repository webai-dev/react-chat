import axios from "axios";
import { Company } from "../../types/types";

const getMyCompanies = async (): Promise<Array<Company>> => {
  try {
    const resp = await axios.get("/api/v1/chat/notifications");
    return resp.data;
  } catch (err) {
    // Error Handling
    return err;
  }
};

export {
  getMyCompanies,
};

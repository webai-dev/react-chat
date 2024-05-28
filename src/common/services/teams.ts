import axios, { Canceler } from "axios";
import { NewRoom } from "../../types";

let cancel: Canceler;

export const getTeams = async (
  companyId: number | null,
  pageNumber: number = 0,
  searchTerm = "",
  pageSize: number = 10
) => {
  let url = `/api/v1/chat/companies/${companyId}/teams/all`;

  try {
    if (cancel !== undefined) cancel();
    const res = await axios({
      method: "GET",
      url,
      params: {
        page: pageNumber,
        size: pageSize,
        searchTerm,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    });

    return res.data;
  } catch (err) {
    if (axios.isCancel(err)) return err;
    return null;
  }
};

// export const createTeamChat = async (
//   companyId: number | null,
//   teamId: number
// ): Promise<NewRoom> => {
//   let url = `/api/v1/teams/companies/${companyId}/teams/${teamId}/chat`;

//   try {
//     const resp = await axios.post(url, {});

//     return resp.data;
//   } catch (err) {
//     console.error(err);
//     return err;
//   }
// };

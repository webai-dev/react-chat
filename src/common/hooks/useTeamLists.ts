import { useState, createContext, useEffect } from "react";

import {
  CompanyTeamList,
  TeamListResponse,
  UseTeamLists,
} from "../../types/types";
import { getTeams } from "../services/teams";

export const useTeamLists = (activeCompanyId: number | null) => {
  let [companyTeamLists, setCompanyTeamLists] = useState<CompanyTeamList[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const activeTeamList =
    companyTeamLists.find((team) => team.companyId === activeCompanyId) || null;

  useEffect(() => {
    if (!activeTeamList && activeCompanyId) {
      setLoadingList(true);
      getTeams(activeCompanyId, 1).then((data: TeamListResponse | null) => {
        if (data) {
          companyTeamLists.push({
            companyId: activeCompanyId,
            teams: data.data,
            page: data.page,
            size: data.size,
            searchTerm: null,
            hasMore: data.totalPages > data.page,
          });
          setLoadingList(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompanyId]);

  useEffect(() => {
    if (activeTeamList && activeTeamList.searchTerm !== null) {
      setLoadingList(true);
      getTeams(activeCompanyId, 1, searchTerm).then(
        (data: TeamListResponse | null) => {
          if (data) {
            activeTeamList.teams = data.data;
            activeTeamList.page = data.page;
            activeTeamList.size = data.size;
            activeTeamList.hasMore = data.totalPages > data.page;

            setLoadingList(false);
            updateCompanyTeamLists(activeTeamList);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeamList, searchTerm]);

  const loadNextPage = () => {
    let companyTeamList = companyTeamLists.find(
      (teamList) => teamList.companyId === activeCompanyId
    );

    if (companyTeamList) {
      setLoadingNextPage(true);
      getTeams(
        activeCompanyId,
        companyTeamList.page + 1,
        companyTeamList.searchTerm || ""
      ).then((data: TeamListResponse | null) => {
        if (data) {
          companyTeamList = {
            companyId: companyTeamList?.companyId || null,
            teams: [...(companyTeamList?.teams || []), ...data.data],
            page: data.page,
            size: data.size,
            searchTerm: companyTeamList?.searchTerm || null,
            hasMore: data.totalPages > data.page,
          };

          setLoadingNextPage(false);
          updateCompanyTeamLists(companyTeamList);
        }
      });
    }
  };

  const updateCompanyTeamLists = (companyTeamList: CompanyTeamList) => {
    const updatedCompanyTeamLists = companyTeamLists.map((teamList) => {
      if (teamList.companyId === companyTeamList?.companyId) {
        return companyTeamList;
      } else {
        return teamList;
      }
    });

    setCompanyTeamLists(updatedCompanyTeamLists);
  };

  const setTeamListSearchTerm = (search: string) => {
    setSearchTerm(search);
    const companyTeamList = companyTeamLists.find(
      (teamList) => teamList.companyId === activeCompanyId
    );

    if (companyTeamList) {
      companyTeamList.searchTerm = search;
      updateCompanyTeamLists(companyTeamList);
    }
  };

  const getTeamItemById = (teamId: number) => {
    for (let i = 0; i < companyTeamLists.length; i++) {
      const team = companyTeamLists[i].teams.find((r) => r.id === teamId);

      if (team) {
        return team;
      }
    }

    return null;
  };

  return {
    companyTeamLists,
    activeTeamList,
    loadingList,
    searchTerm,
    setSearchTerm,
    loadingNextPage,
    setCompanyTeamLists,
    setTeamListSearchTerm,
    loadNextPage,
    getTeamItemById,
  };
};

export const TeamListsContext = createContext({} as UseTeamLists);

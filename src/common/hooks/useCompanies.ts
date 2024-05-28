import { useState, createContext, useEffect } from "react";

import { getMyCompanies } from "../services/companies";
import { Company, UseCompany } from "../../types/types";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    getMyCompanies().then((companies: Array<Company>) => {
      let companiesLocal = localStorage.getItem("companies");
      let selectedCompanyLocal = localStorage.getItem("selectedCompany");
      // if (companiesLocal && JSON.parse(companiesLocal) !== undefined) {
      //   setCompanies(JSON.parse(companiesLocal));
      // } else {
        localStorage.setItem("companies", JSON.stringify(companies));
        setCompanies(companies);
      // }

      if (selectedCompanyLocal) {
        setSelectedCompany(JSON.parse(selectedCompanyLocal));
      } else {
        if (companies && companies[0]) {
          localStorage.setItem("selectedCompany", JSON.stringify(companies[0]));
          setSelectedCompany(companies[0]);
        }
      }
    });
  }, []);

  return { companies, setCompanies, selectedCompany, setSelectedCompany };
};

export const CompanyContext = createContext({} as UseCompany);

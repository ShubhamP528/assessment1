import React from "react";

const CompanyList = ({ data, onSelectCompany }) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Companies</h1>
      <div className="space-y-2">
        {data.map((company, index) => (
          <button
            key={index}
            className="block w-full text-left p-3 mb-2 bg-white rounded-md shadow hover:bg-blue-100 transition cursor-pointer"
            onClick={() => onSelectCompany(company)}
          >
            {company.index_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;

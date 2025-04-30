// export default function CompanyList({
//   companies,
//   selectedCompany,
//   onSelectCompany,
//   closeMenu,
//   loading,
// }) {
//   return (
//     <nav className="flex flex-col h-full">
//       <h2 className="text-lg font-semibold p-4 pb-2 text-gray-700 border-b">
//         Nifty Indices
//       </h2>

//       {/* Scrollable area with native scrollbar */}
//       <div className="flex-1 overflow-y-auto px-4 pt-3 h-[400px]">
//         {loading ? (
//           <div className="animate-pulse space-y-2">
//             {[...Array(50)].map((_, i) => (
//               <div key={i} className="h-8 bg-gray-200 rounded-lg"></div>
//             ))}
//           </div>
//         ) : (
//           <ul className="space-y-2 pr-2 pb-4">
//             {companies.map((company, index) => (
//               <li key={`${company}-${index}`}>
//                 <button
//                   onClick={() => {
//                     onSelectCompany(company);
//                     closeMenu();
//                   }}
//                   className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                     selectedCompany === company
//                       ? "bg-blue-500 text-white"
//                       : "hover:bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {company}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// }

export default function CompanyList({
  companies,
  selectedCompany,
  onSelectCompany,
  closeMenu,
  loading,
}) {
  return (
    <nav className="flex flex-col h-[800px]">
      <h2 className="text-lg font-semibold p-4 pb-2 text-gray-700 border-b">
        Companies
      </h2>

      {/* Scrollable container */}
      <div className="flex-1 overflow-hidden mt-3">
        {" "}
        {/* Changed to overflow-hidden */}
        <div className="h-full overflow-y-auto px-4 pt-3">
          {" "}
          {/* Wrapping div for scroll */}
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2 pr-2 pb-4">
              {companies.map((company, index) => (
                <li key={`${company}-${index}`}>
                  <button
                    onClick={() => {
                      onSelectCompany(company);
                      closeMenu();
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCompany === company
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {company}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

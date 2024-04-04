import React, { createContext, useContext, useState } from 'react';
import { listvenderinterface } from '../../models/VendorProject/Vendor';






export const lengthlistVendorContext = createContext({ length: {},
    setProject: () => { }}
   );

// Create a provider component
// export const ProjectProvider = ({ children }) => {
//     const [detailProject,setdetailProject]=useState<DetailProjectInterface>()//ไม่เอาแบบมีbuckect <DetailProjectInterface[]>([]) ก็dataมันมีแค่ตัวเดียว


//   return (
//     <ProjectContext.Provider value={{ detailProject, setdetailProject }}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// // Create a custom hook to use the context
// export const useProjectContext = () => {
//   return useContext(ProjectContext);
// };
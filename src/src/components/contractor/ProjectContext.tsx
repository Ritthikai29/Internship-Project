import React, { createContext, useContext, useState } from 'react';
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import { listvenderinterface } from '../../models/VendorProject/Vendor';




export const ProjectContext = createContext<DetailProjectInterface | undefined>(undefined);

export const listVendorContext = createContext<listvenderinterface | undefined>(undefined);

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
import ManagementHistory from '../pages/Vender/ManagementHistory';
import ProjectOwnerEdit from '../pages/Project/ProjectOwnerEdit';
import ProjectWaitingToManaged from '../pages/Project/ProjectWaitingToManaged';
import ProjectHistory from '../pages/Project/ProjectHistory';
import ManageProject from '../pages/Project/ManageProject';
import ProjectParticipants from '../pages/Project/ProjectParticipants';
import ProjectResult from '../pages/Project/ProjectResult';


const ProjectRoutes = [
    { path: '/project/Vender/ManagementHistory', element: <ManagementHistory /> },
    { path: '/project/waitingtomanaged', element: <ProjectWaitingToManaged />, roles: ['Contractor']  },
    { path: '/project/edit', element: <ProjectOwnerEdit /> },
    { path: '/project', element: <ProjectHistory /> },
    { path: '/project/ManageProject', element: <ManageProject /> },
    { path: '/project/Participants', element: <ProjectParticipants /> },
    { path: '/project/AnnouncementResultComponent/:key', element: <ProjectResult /> },
    
];

export default ProjectRoutes;
 
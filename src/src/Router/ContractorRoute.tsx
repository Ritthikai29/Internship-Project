import Outside from '../components/contractor/Outside';
import ProjectsWaiting from '../pages/ProjectsWaiting/ProjectsWaiting';
import AllProjectParticipants from '../pages/contractor/AllProjectParticipants';
import Contractor from '../pages/contractor/Contractor';
import ConntractorCheckList from '../pages/contractor/ContractorCheckList';
import VerifyUnlistVendor from '../pages/contractor/VerifyUnlistVendor/VerifyUnlistVendor';
import SuccessfulPage from '../pages/contractor/VerifyUnlistVendor/SuccessfulPage';
import ErrorVerifyVendorPage from '../pages/contractor/VerifyUnlistVendor/ErrorVerifyVendorPage';
import RejectVerifyUnlistVendor from '../pages/contractor/VerifyUnlistVendor/RejectVerifyUnlistVendor';
import ApproveUnlistVendor from '../pages/contractor/ApproveUnlistVendor/ApproveUnlistVendor';
import RejectApproveUnlistVendor from '../pages/contractor/ApproveUnlistVendor/RejectApproveUnlistVendor';
import SuccessfulApproveVendorPage from '../pages/contractor/ApproveUnlistVendor/SuccessfulPage';
import ErrorApproveVendorPage from '../pages/contractor/ApproveUnlistVendor/ErrorApproveUnlistVendor';
import ContractorAnnouncement from '../pages/Announcement/ContractorAnnouncement';
import ApproveProjectSetting from '../pages/contractor/ProjectSetting/ApproveProjectSetting';
import SuccessProjectSetting from '../pages/contractor/ProjectSetting/SuccessProjectSetting';
import ErrorProjectSetting from '../pages/contractor/ProjectSetting/ErrorProjectSetting';
import WaitSendParticipant from '../pages/contractor/WaitSendParticipant';
import WaitSendVendor from '../pages/contractor/WaitSendVendor';
import RejectProjectSetting from '../pages/contractor/ProjectSetting/RejectProjectSetting';
import AnnouncementResultComponent from '../components/ManageProject/AnnouncementResultComponent';

const ContractorRoute = [
    { path: "/contractor/:key", element: <Contractor />, roles: ['Contractor'] },
    { path: "/contractor/AnnouncementResultComponent/:key", element: <AnnouncementResultComponent />, roles: ['Contractor'] },
    { path: "/contractor/AllParticipants", element: <AllProjectParticipants />, roles: ['Contractor'] },
    { path: "/contractor/ProjectsWaiting", element: <ProjectsWaiting />, roles: ['Contractor'] },
    { path: "/contractor/outside", element: <Outside />, roles: ['Contractor'] },
    { path: "/contractor/contractorchecklist", element: <ConntractorCheckList />, roles: ['Contractor'] },
    { path: "/contractor/waitsendparticipant", element: <WaitSendParticipant />, roles: ['Contractor'] },
    { path: "/contractor/waitsendvendor", element: <WaitSendVendor />, roles: ['Contractor'] },
    // in email will run with link http://____/contractor/verify-unlist-vendor/approve?approve_id=??
    { path: '/contractor/verify-unlist-vendor/approve', element: <VerifyUnlistVendor /> },
    { path: '/contractor/verify-unlist-vendor/reject', element: <RejectVerifyUnlistVendor /> },
    { path: '/contractor/verify-unlist-vendor/successful', element: <SuccessfulPage /> },
    { path: '/contractor/verify-unlist-vendor/error', element: <ErrorVerifyVendorPage /> },
    // in email will run with link http://____/contractor/approve-unlist-vendor/approve?approve_id=??
    { path: '/contractor/approve-unlist-vendor/approve', element: <ApproveUnlistVendor /> },
    { path: '/contractor/approve-unlist-vendor/reject', element: <RejectApproveUnlistVendor /> },
    { path: '/contractor/approve-unlist-vendor/successful', element: <SuccessfulApproveVendorPage /> },
    { path: '/contractor/approve-unlist-vendor/error', element: <ErrorApproveVendorPage /> },
    { path: '/contractor/project-setting', element: <ApproveProjectSetting /> },
    { path: '/contractor/project-setting/success', element: <SuccessProjectSetting /> },
    { path: '/contractor/project-setting/error', element: <ErrorProjectSetting /> },
    { path: '/contractor/reject-project-setting', element: <RejectProjectSetting /> },
    { path: "/contractor/announcement", element: <ContractorAnnouncement /> },
];

export default ContractorRoute;

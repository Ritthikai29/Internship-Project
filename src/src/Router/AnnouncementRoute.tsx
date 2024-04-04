import Announcement from '../pages/Announcement/Announcement';
import ContractorAnnouncement from '../pages/Announcement/ContractorAnnouncement';

const AnnouncementRoutes = [
    { path: "/project/announcement", element: <Announcement /> },
    { path: "/vender/announcement", element: <ContractorAnnouncement /> },
];

export default AnnouncementRoutes;

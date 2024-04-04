import VenderAfterNegotiating from '../pages/Vender/VenderAfterNegotiating';
import VenderHistory from '../pages/Vender/VenderHistory';
import VenderQuotation from '../pages/Vender/VenderQuotation';
import VenderWaitToManage from '../pages/Vender/VenderWaitToManage';
import ManagementHistory from '../pages/Vender/ManagementHistory';
import VenderEditQuotation from '../pages/Vender/VenderEditQuotation';

const VenderRoutes = [
    { path: '/vender/history', element: <VenderHistory /> },
    { path: '/vender/waittomanage', element: <VenderWaitToManage /> },
    { path: '/vender/quotation', element: <VenderQuotation /> },
    { path: '/vender/afternegotiating', element: <VenderAfterNegotiating /> },
    { path: '/vender/ManagementHistory', element: <ManagementHistory /> },
    { path: '/vender/Editquotation', element: <VenderEditQuotation /> },
];

export default VenderRoutes;

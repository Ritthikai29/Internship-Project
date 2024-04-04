import ApproveBidding from '../pages/Md/ApproveBidding';
import SuccessApproveBidding from '../pages/Md/SuccessApproveBidding';
import ErrorApproveBidding from '../pages/Md/ErrorApproveBidding';
import RejectBidding from '../pages/Md/RejectBidding';
import BargainBidding from '../pages/Md/BargainBidding';
import ResultBidding from '../pages/Md/ResultBidding';

const MdRoutes = [
    { path: '/md/approve-bidding', element: <ApproveBidding /> },
    { path: '/md/approve-bidding/success', element: <SuccessApproveBidding /> },
    { path: '/md/approve-bidding/error', element: <ErrorApproveBidding /> },

    { path: '/md/reject-bidding', element: <RejectBidding /> },
    { path: '/md/reject-bidding/success', element: <SuccessApproveBidding /> },
    { path: '/md/reject-bidding/error', element: <ErrorApproveBidding /> },

    { path: '/md/bargain-bidding', element: <BargainBidding /> },
    { path: "/md/Result-bidding/:key", element: <ResultBidding /> },
];

export default MdRoutes;

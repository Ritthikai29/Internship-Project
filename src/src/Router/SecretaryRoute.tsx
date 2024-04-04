import SecretaryWaitToManage from '../pages/Secretary/SecretaryWaitToManage';
import SelectListDataWaitToManage from '../pages/Secretary/SelectListDataWaitToManage';
import SelectListOpeningSchedule from '../pages/Secretary/SelectListOpeningSchedule';
import WTSECommitteeDetails from '../components/Secretary/SpecifiedEnvelop/WaitToSendEmail/WTSECommitteeDetails';
import WTSEDetails from '../components/Secretary/SpecifiedEnvelop/WaitToSendEmail/WTSEDetails';
import WTOCommitteeDetails from '../components/Secretary/SpecifiedEnvelop/WaitToOpen/WTOCommitteeDetails';
import WTOSubmitOTP from '../components/Secretary/SpecifiedEnvelop/WaitToOpen/WTOSubmitOTP';
import WTODetailsPasscord from '../components/Secretary/SpecifiedEnvelop/WaitToOpen/WTODetailsPasscord';
import WTOSelectJobstoOpen from '../components/Secretary/SpecifiedEnvelop/WaitToOpen/WTOSelectJobstoOpen';
import WTOCompareAveragePrices from '../components/Secretary/SpecifiedEnvelop/WaitToOpen/WTOCompareAveragePrices';
import WTOCommitteeComment from '../components/Secretary/SpecifiedEnvelop/WaitToOpen/WTOCommitteeComment';
import WNOfferNewPrice from '../components/Secretary/SpecifiedEnvelop/WaitNegotiate/WNOfferNewPrice';
import WNReprocess from '../components/Secretary/SpecifiedEnvelop/WaitNegotiate/WNReprocess';
import WTARConclusion from '../components/Secretary/SpecifiedEnvelop/WaitToApprovalResults/WTARConclusion';
import WTAConclusion from '../components/Secretary/SpecifiedEnvelop/WaitToAnnounce/WTAConclusion';
import SecretaryPriceComparisionResults from '../pages/Secretary/SecretaryPriceComparisionResults';
import SecretaryProjectWaitToManage from '../pages/Secretary/SecretaryProjectWaitToManage';
import SecretaryManagementHistory from '../pages/Secretary/SecretaryManagementHistory';
import SecretaryListSelect from '../pages/Secretary/SecretaryListSelect';
import SecretrySummaryContestResults from '../pages/Secretary/SecretarySummaryContestResults';
import SettingOpendingSchedule from '../components/Secretary/SpecifiedEnvelop/SettingOpeningSchedule';
import WTSEchangeCommitteeDetails from '../components/Secretary/SpecifiedEnvelop/WaitToSendEmail/WTSEchangeCommitteeDetails';

const SecretaryRoutes = [
    { path: '/secretary/waittomanage', element: <SecretaryWaitToManage />, roles: ['secretary'] },
    { path: '/secretary/openingschedule/openbidsetting', element: <SettingOpendingSchedule />, roles: ['secretary'] },
    { path: '/secretary/datawaittomanage/selectlist', element: <SelectListDataWaitToManage />, roles: ['secretary'] },
    { path: '/secretary/openingschedule/selectlist', element: <SelectListOpeningSchedule />, roles: ['secretary'] },
    { path: '/secretary/projectwaittomanage', element: <SecretaryProjectWaitToManage />, roles: ['secretary'] },
    { path: '/secretary/pricecomparisionresults/:key', element: <SecretaryPriceComparisionResults />, roles: ['secretary'] },
    { path: '/secretary/managementhistory', element: <SecretaryManagementHistory />, roles: ['secretary'] },
    { path: '/secretary/list-select', element: <SecretaryListSelect />, roles: ['secretary'] },
    { path: 'secretary/summary-contest-results', element: <SecretrySummaryContestResults />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wtse/committeedetails', element: <WTSECommitteeDetails />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wtse/changecommitteedetails', element: <WTSEchangeCommitteeDetails />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wtse/details', element: <WTSEDetails />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wto/committeedetails', element: <WTOCommitteeDetails />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wto/submitotp', element: <WTOSubmitOTP />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wto/detailspasscord', element: <WTODetailsPasscord />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wto/selectjobstoopen', element: <WTOSelectJobstoOpen />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wto/compareaverageprices', element: <WTOCompareAveragePrices />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wto/project-summary', element: <WTOCommitteeComment />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wn/offernewprice', element: <WNOfferNewPrice />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wn/reprocess', element: <WNReprocess />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wtar/conlcusion', element: <WTARConclusion />, roles: ['secretary'] },
    { path: '/secretary/specifiedevenelope/wta/conlcusion', element: <WTAConclusion />, roles: ['secretary'] },
];

export default SecretaryRoutes;

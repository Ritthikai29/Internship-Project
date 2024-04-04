import CommitteeHistory from '../pages/Committee/CommitteeHistory';
import CommitteeProjectWaitToOpen from '../pages/Committee/CommitteeProjectWaitToOpen';
import CommitteePasscode from '../components/Committee/CommitteeProjectWaitToOpen/CommitteePasscode';
import WaitForOtherCommittee from '../components/Committee/CommitteeProjectWaitToOpen/WaitForOtherCommittee';
import CommitteeJobLists from '../components/Committee/CommitteeProjectWaitToOpen/CommitteeJobLists';
import CommitteeJobDetails from '../components/Committee/CommitteeProjectWaitToOpen/CommitteeJobDetails';
import CommitteeManagementHistory from '../pages/Committee/CommitteeManagementHistory';
import CommitteeListSelect from '../pages/Committee/CommitteeListSelect';
import CommitteeSummaryContestResults from '../pages/Committee/CommitteeSummaryContestResults';

const CommitteeRoutes = [
    { path: "/committee/history", element: <CommitteeHistory />, roles: ['chairman','committee']  },
    { path: "/committee/projectwaittoopen", element: <CommitteeProjectWaitToOpen />, roles: ['chairman','committee']   },
    { path: "/committee/management-history", element: <CommitteeManagementHistory />, roles: ['chairman','committee']   },
    { path: "/committee/list-select", element: <CommitteeListSelect />, roles: ['chairman','committee']   },
    { path: "/committee/summary-contest-results", element: <CommitteeSummaryContestResults />, roles: ['chairman','committee']   },
    
    { path: "/committee/projectwaittoopen/passcode", element: <CommitteePasscode />, roles: ['chairman','committee']   },
    { path: "/committee/projectwaittoopen/waitforothercommittee", element: <WaitForOtherCommittee />, roles: ['chairman','committee']   },
    { path: "/committee/projectwaittoopen/joblists", element: <CommitteeJobLists />, roles: ['chairman','committee']   },
    { path: "/committee/projectwaittoopen/jobdetails", element: <CommitteeJobDetails />, roles: ['chairman','committee']   },
];

export default CommitteeRoutes;

import Approve1 from '../pages/Budget/Approve1';
import Approve2 from '../pages/Budget/Approve2';
import Calculate from '../pages/Budget/Calculate';
import Verify from '../pages/Budget/Verify';
import Verify2 from '../pages/Budget/Verify2';

const BudgetRoutes = [
    { path: "/budget/calculate", element: <Calculate /> },
    { path: "/budget/verify", element: <Verify /> },
    { path: "/budget/verify2", element: <Verify2 /> },
    { path: "/budget/approve1", element: <Approve1 /> },
    { path: "/budget/approve2", element: <Approve2 /> },
];

export default BudgetRoutes;

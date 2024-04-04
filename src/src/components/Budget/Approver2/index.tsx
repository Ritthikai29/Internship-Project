import LogComponent from '../LogCalculate/LogComponent'
import CreateApprove2Component from './CreateApprove2Component'
import ViewApprove2Project from './ViewApprove2Project'

export default function MainApprove2Component() {
  return (
    <div className="my-[6rem] w-5/6 mx-auto">

      <ViewApprove2Project />

      <CreateApprove2Component />

      <LogComponent />
    </div>
  )
}

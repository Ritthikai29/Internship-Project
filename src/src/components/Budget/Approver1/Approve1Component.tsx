import { useEffect } from "react";
import ViewApprove1Project from "./ViewApprove1Project";
import CreateApprove1Component from "./CreateApprove1Component";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function Approve1Component(
  {
    projectId
} : {
    projectId: string;
}
) {

    useEffect(() => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'กำลังดาวน์โหลด',
            html: '<p>โปรดรอสักครู่ ...</p>',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
              MySwal.showLoading(); // Show the loading spinner
            },
            willClose: () => {
              MySwal.hideLoading(); // Hide the loading spinner
            },
          });

        setTimeout(() => {
            MySwal.close()
        }, 3000)
    })
    return (
        <div className="my-[6rem]  w-5/6 mx-auto">
            {/* Container view project */}
            <ViewApprove1Project />

            {/* component for approveing from approve 1 */}
            <CreateApprove1Component 
              projectId={projectId || ""}
            />



            {/* component to load a log to show to all user */}

        </div>
    )
}

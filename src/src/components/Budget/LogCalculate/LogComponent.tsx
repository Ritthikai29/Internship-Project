import React, { useEffect, useState } from 'react'
import { dateWithTimeFormatter, datetimeFormatter } from '../../../services/utilitity'
import { GetAllLogCalculateByProjectKey } from '../../../services/BudgetService/BudgetLogService'
import { IBudgetLog } from '../../../models/Budget/BudgetLog/IBudgetLog';
import ReactPaginate from 'react-paginate';
import { GetLogByProjectKeyWithLimit } from '../../../services/BudgetService/LogCalculateService';
import LimitStringWithUrl from '../../PreLoadAndEtc/LongLetter';

export default function LogComponent() {

    // should be check a parameter on url 
    const queryParameters = new URLSearchParams(window.location.search)
    const [projectKey] = useState<string>(queryParameters.get("pj") || "");

    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0)
    const [totalLog, setTotalLog] = useState(0);

    const [logs, setLogs] = useState<IBudgetLog[]>([]);

    const getLogWithPagination = async (page: number) => {
        const limit = 10;
        const res = await GetLogByProjectKeyWithLimit(
            projectKey,
            page
        )
        setLogs(res.data)
        setTotalLog(res.total)
        let totalPage = Math.ceil(res.total / limit)
        setTotalPage(totalPage);
    }

    const handlePaginateClick = (e: { selected: number }) => {
        setPage(e.selected)
    }

    useEffect(() => {
        getLogWithPagination(page)
    }, [page])

    return (
        <div className='flex border flex-col my-3 rounded-2xl  drop-shadow-xl bg-white pb-5 '>
            <div className='mb-6 bg-[#1D5182] w-full rounded-t-2xl px-10 py-5 '>
                <h3 className='text-4xl font-bold text-white'>ประวัติการดำเนินการ</h3>
            </div>
            <table className='table-fixed mx-auto w-11/12 '>
                <thead className='bg-[#DFDFDF]'>
                    <tr >
                        <th className='py-4 text-lg text-black text-center rounded-tl-lg'>
                            วันที่/เวลา
                        </th>
                        <th className='py-4 text-lg text-black text-center'>
                            รายละเอียดการดำเนินการ
                        </th>
                        <th className='py-4 text-lg  text-black text-center'>
                            ดำเนินการโดย
                        </th>
                        <th className='py-4 text-lg  text-black text-center rounded-tr-lg'>
                            อื่นๆ
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.isArray(logs) &&
                        logs.map((item) => (
                            <tr className='border' key={item.id} style={{ verticalAlign: 'top' }}>
                                <td className='whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none'>
                                    {dateWithTimeFormatter(item.action_datetime)}
                                </td>
                                <td className='whitespace-no-wrap text-lg text-left border rounded py-2 px-2 focus:outline-none'>
                                    {item.log_action}
                                </td>
                                <td className='whitespace-no-wrap text-lg text-left border rounded py-2 px-2 focus:outline-none'>
                                    {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                                </td>
                                <td className='whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none'>
                                    <span className='text-red-500'>{item.reason_t ? <LimitStringWithUrl string={item.reason_t} maxChars={30}/> : "-"}</span> <br />
                                    {item.reject_detail ? <LimitStringWithUrl string={item.reject_detail} maxChars={30}/>: " "}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div className='flex justify-end mt-5 mr-5'>
                <ReactPaginate
                    className="flex gap-5 col-start-10 col-end-12 "
                    pageClassName="border rounded-full focus:shadow-outline hover:text-black "
                    activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
                    nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                    previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                    pageLinkClassName='flex justify-center items-center w-10 h-10 transition-colors duration-150 rounded-full focus:shadow-outline'
                    breakClassName="text-[#EB455F]"
                    pageCount={totalPage}
                    pageRangeDisplayed={0}
                    marginPagesDisplayed={3}
                    nextLabel=">"
                    previousLabel="<"
                    onPageChange={handlePaginateClick}
                />
            </div>
        </div>
    )
}




export default function DenialAccessSetting() {

    return (
        <div className="flex flex-col w-full">
    <div className="grid grid-cols-12 p-4   w-full">
        <div className="col-start-2 col-end-12">
            <div className="pl-8 pb-8 rounded-lg bg-red-600 text-white items-center drop-shadow-lg w-full">
                <div className="pl-5 pb-5 pt-10 flex items-center">
                    <span className="text-4xl font-bold leading-tight">
                        <i className="fas fa-exclamation-circle mr-2"></i>ไม่อนุญาตให้เข้าตั้งค่าโครงการ
                    </span>
                </div>
                <div className="ml-8">
                    <h1 className="text-2xl">
                        ท่านจะทำรายการนี้ได้ เมื่อดำเนินการข้อ 1 จัดการผู้เข้าร่วมโครงการครบตามระเบียบงานจ้างเหมา
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>
    )  
}
import Pic from "../../assets/ProjectWaitingToManaged.png";

export default function SecretaryBanner() {
    return (
        <div>
            <div className="px-4">
                <div style={{
                    backgroundImage: `url(${Pic})`
                }} className="w-full h-96 flex justify-end items-end">

                    <p className="pb-12 pr-12 text-white text-7xl font-bold">โครงการที่รอจัดการ</p>
                </div>
            </div>
        </div>
    )
}
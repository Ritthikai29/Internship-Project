
export default function LoadingComponent() {
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
            <div>
                <h1>
                    กรุณารอสักครู่...
                </h1>
            </div>
        </div>
    )
}

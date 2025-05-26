export default function Header() {
    return (
        <section className="w-full h-fit p-4 bg-transparent flex items-center justify-between">
            <h1> Dashboard </h1>

            {/* Avatar */}
            <div className="p-4 flex justify-left">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-sm">N</span>
                </div>
            </div>
        </section>
    )
}
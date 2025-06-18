import UserComp from "./userComp";

export default function UserPage() {
    return (
        <main className="h-screen w-full flex flex-col items-start justify-left bg-[#131313] text-[var(--txt-clr)] text-3xl">
            <h1 className="grid pry-ff justify-start p-4 font-semibold">
                Users
            </h1>
            <UserComp />
        </main>
    );
}
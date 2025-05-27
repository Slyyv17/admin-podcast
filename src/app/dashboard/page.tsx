import MainDBComp from "@/components/mainDBComp";
import Header from '@/components/header';

export default function DashboardPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--bg-clr)] p-4 overflow-x-hidden flex flex-col items-center justify-start">
            <Header />
            <MainDBComp />
        </main>
    );
}

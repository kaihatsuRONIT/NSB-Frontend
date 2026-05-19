import UserSettings from "@/components/User/UserSettings";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <div className="bg-black">
                <Link href="/profile"><span
                    className="flex items-center gap-2 text-sm mb-6 p-5"
                    style={{ color: '#6B7280' }}
                >
                    ← Back to Profile
                </span></Link>
                <UserSettings />
            </div>
        </>
    );
}
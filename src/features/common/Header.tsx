import Link from "next/link";
import Navbar from "./Navbar";
import Profile from "./Profile";

export default function Header() {

    return (
        <header className="bg-white w-full h-16 flex items-center justify-between px-5">
            <Link href='/'> 
                <img src="/images/알고가_로고.png" alt="로고" className="w-[130px] h-[45px] cursor-pointer"/>
            </Link>
            <Navbar/>
            <Profile/>
        </header>
    )
}
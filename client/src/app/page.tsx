import "./styles.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import { App } from "@/components/App";
import { verifyToken } from "@/lib/jwt";
import { FilterIcon, SearchIcon } from "@/components/Svgs";

export default async function Page() {
	const cookieStore = cookies();
  	const sessionToken = cookieStore.get('session');
	
	try { let sessionData = await verifyToken(sessionToken?.value || '', process.env.JWT_SESSION_SECRET || ''); } catch (error) { console.log("Session not found!"); redirect("/login"); }

	return (<>
		<App>
			<div className="main">
                <div className="main__left">
                    <div className="left__header">
                        <Image className="left__header--profileImg" height={40} width={40}  src="/defaultProfile.png" alt="not found!" priority={true}></Image>
                    </div>

                    <div className="left__header--search">
                        <span className="header__search--left">
                            <SearchIcon className="header__search--leftIcon"  />
                        </span>
                        <span className="header__search--right">
                            <FilterIcon className="" />
                        </span>
                    </div>
                </div>
                
                <div className="main__right">
                    <div className="right__header">
                        
                    </div>
                </div>
            </div>
		</App>
	</>);
}

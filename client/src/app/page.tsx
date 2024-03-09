import { App } from "@/components/App";
import { cookies } from "next/headers";

export default function Page() {
	const cookieStore = cookies();
  	const sessionToken = cookieStore.get('session');
	console.log(sessionToken);

	return (<>
		<App />
	</>);
}

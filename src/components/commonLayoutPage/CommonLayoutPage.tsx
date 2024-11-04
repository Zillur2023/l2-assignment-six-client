'use client'

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Posts from "../post/Posts";
import { useUser } from "@/context/user.provider";

const CommonLayoutPage = () => {
    const router = useRouter();
    // const { user } = useAppSelector((state: RootState) => state.auth);
    const { user } = useUser();

    console.log('CommonLayoutpage', user)
  
    useEffect(() => {
      // If not loading and userData is available
      if ( user ) {
        if (user?.role === "admin") {
          router.push("/admin/user-management");
        } else if (user?.role === "user") {
          router.push("/profile/news-feed");
        }
      }
    }, [user, router]);
  
    // Render <Posts /> if user is null (not logged in)
    if (user === null) {
      return <Posts />;
    }
  
    // Optionally show a loading state until the redirect logic executes
    return null;
  };
  
  export default CommonLayoutPage;
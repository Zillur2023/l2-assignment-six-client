'use client'

// import { useAppSelector } from "@/redux/hooks";
// import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Posts from "../post/Posts";
// import { useUser } from "@/context/user.provider";
import Loading from "../UI/Loading";
import { useUser } from "@/context/user.provider";

const CommonLayoutPage = () => {
    const router = useRouter();
    // const { user } = useAppSelector((state: RootState) => state.auth);
    const { user } = useUser();
    const [loading, setLoading] = useState(false); 

    console.log("commonLayout USER--->", user)

    useEffect(() => {
      const redirectUser = async () => {
        // Show loading spinner
        setLoading(true);
  
        // Redirect user based on role
        if (user !== undefined) {
          if (user) {
            if (user.role === "admin") {
               router.push("/admin/user-management");
            } else if (user.role === "user") {
               router.push("/profile/news-feed");
            }
          }
        }
        
        // Hide loading spinner after navigation
        setLoading(false);
      };
  
      redirectUser();
    }, [user, router]);

    if (loading) {
      return <Loading/>; // Replace with your spinner component or animation
    }
  
    // Render <Posts /> if user is null (not logged in)
    if (user === null) {
      return <Posts />;
    }
  
    // Optionally show a loading state until the redirect logic executes
    return null;
  };
  
  export default CommonLayoutPage;
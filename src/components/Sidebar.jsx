import React from "react";
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIoArrowForward } from 'react-icons/io';
import logo from '../assets/logo.png';
import { categories } from "../utils/data"


const Sidebar = ({user, closeToggle}) => {
    const handleCloseSidebar = () =>{
        if (closeToggle) closeToggle(false)
    }

    const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize"
    const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-black transition-all duration-200 ease-in-out capitalize"
    

    return ( 
        <main className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
            <div className="flex flex-col overflow-auto">
                <Link 
                to='/'
                className='w-3/6 h-3/6 m-auto'
                onClick={handleCloseSidebar}
                >
                    <img src={logo} alt="logo" className="object-cover"/>
                </Link>
                <div className="flex flex-col gap-5">
                    <NavLink 
                    to='/'
                    className = {({isActive})=> isActive ? isActiveStyle : isNotActiveStyle}
                    onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className="mt-2 px-5 text-base 2x1:text-21">Discover Categories</h3>
                    {
                        categories.map((category)=>{
                            return (
                                <NavLink
                                to={`/category/${category.name}`}
                                className = {({isActive})=> isActive ? isActiveStyle : isNotActiveStyle}
                                onClick={handleCloseSidebar}
                                key={category.name}
                                >
                                    <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" alt="category"/>
                                    {category.name}
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>
            {user && (
                <Link
                to={`user-profile/${user?._id}`}
                className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
                onClick={handleCloseSidebar}
                >
                    <img src={user.image} className="w-10 h-10 rounded-full" alt="user-profile" />
                    <p>{user.userName}</p>
                    
                </Link>
            )}
        </main>
     );
}
 
export default Sidebar;

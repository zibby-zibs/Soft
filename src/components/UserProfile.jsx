import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import {Link,  useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { FcGoogle } from 'react-icons/fc';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';
const randomImage = "https://source.unsplash.com/1600x900/?anime"

const UserProfile = () => {

    const [user, setUser] = useState();
    const [pins, setPins] = useState();
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const navigate = useNavigate();
    const { userId } = useParams();

    const logout = ()=>{
        localStorage.clear();
        navigate("/")
    }

    useEffect(()=>{
        const query = userQuery(userId)
        client.fetch(query)
            .then((data)=>{
                setUser(data[0])
            })

    },[userId])

    useEffect(()=>{
        if(text === "Created"){
            const createdPinsQuery = userCreatedPinsQuery(userId)

            client.fetch(createdPinsQuery)
                .then((data)=>{
                    setPins(data)
                })
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId)

            client.fetch(savedPinsQuery)
                .then((data)=>{
                    setPins(data)
                })
        }
    },[text, userId])


    if(!user){
      return <Spinner message="Loading your profile"/>  
    }

    return ( 
        <main className='relative pb-2 h-full justify-center items-center '>
            <section className='flex flex-col pb-5'>
                <aside className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img
                            src={randomImage}
                            alt="banner-pitch" 
                            className='w-full h-370 2xl:h-510 shadow-lg object-cover'
                        />
                        <img
                            src={user.image}
                            alt="user-pic"
                            className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
                        />
                        <h1 className='font-bold text-3xl text-center mt-3'>{user.userName}</h1>
                        <div className='absolute top-0 z-1 right-9'>
                            {userId === user.id && (
                                <GoogleLogout
                                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                                render={(renderProps)=> (
                                    <button
                                    type="button"
                                    className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-lg"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
    
                                    >
                                        <AiOutlineLogout color="red" font= {21} />
                                    </button>
                                )}
                                onLogoutSSuccess={logout}
                                
                                cookiePolicy='single_host_origin'
                                />
                            )}
                        </div>
                    </div>
                    <div className='text-center mb-7'>
                        <button
                            type='button'
                            onClick={(e)=>{
                                setText(e.target.textContent)
                                setActiveBtn("created")
                            }}
                            className={`${activeBtn === "created"? activeBtnStyles: notActiveBtnStyles}`}
                        >
                            Created
                        </button>
                        <button
                            type='button'
                            onClick={(e)=>{
                                setText(e.target.textContent)
                                setActiveBtn("saved")
                            }}
                            className={`${activeBtn === "saved"? activeBtnStyles: notActiveBtnStyles}`}
                        >
                            Saved
                        </button>
                    </div>
                   {
                    pins.length ? (
                        <div className='px-2'>
                         <MasonryLayout pins={pins} />
                        </div>
                    ): (
                        <div className="flex flex-col gap-2  justify-center font-bold items-center w-full text-xl mt-2">
                            <h2 >You don't have Pins ):</h2>
                            <h2>
                                <Link to="/create-pin" style={{textDecoration:"underline"}}>Create</Link>
                                <nbsp/><nbsp/> or <nbsp/><nbsp/>
                                <Link to="/" style={{textDecoration:"underline"}}>Save</Link>
                            </h2>
                        </div>
                    )
                   }
                </aside>
            </section>
        </main>
     );
}
 
export default UserProfile;
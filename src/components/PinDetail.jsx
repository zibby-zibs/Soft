import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from  "react-icons/md"
import { Link, useParams }from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

import { client, urlFor } from "../client"
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({user}) => {

    const { pinId } = useParams();
    const [pins, setPins] = useState();
    const [pinDetail, setPinDetail] = useState();
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);


    const fetchPinDetails =() => {

        //originally fetch the details of pin with ref to Id of the pin image
        let query = pinDetailQuery(pinId);

        if (query){
            client.fetch(query)
            .then((data)=>{
                setPinDetail(data[0])

                if(data[0]){
                    //after getting details of the pin (title,about,category...)
                    //we will get pins related to that particular pin by category
                    query = pinDetailMorePinQuery(data[0])

                    client.fetch(query)
                    .then((res)=> setPins(res))
                }
            })
        }
    }

    useEffect(()=>{
        fetchPinDetails();
    },[pinId])

    const postComment= ()=>{
        if(comment){
         setAddingComment(true);
         client
            .patch(pinId)
            .setIfMissing({comments: []})
            .insert("after", "comments[-1]", [{
                comment,
                key: uuidv4(),
                postedBy: {
                    _type: "postedBy",
                    _ref: user._id,
                }
            }])
            .commit()
            .then(()=>{
                fetchPinDetails();
                setComment("")
                setAddingComment(false)
            })
        }
    }


    if(!pinDetail) return <Spinner message="loading pin..." />

    return ( 
        <>
            {pinDetail &&(    
                <main className="flex xl-flex-row flex-col m-auto bg-white " style={{maxWidth:"1500px",borderRadius:"32px"}}>
                    <section className="flex justify-center items-center md:items-start flex-initial"> 
                        <img 
                            src={pinDetail?.image && urlFor(pinDetail.image).url()}
                            alt="user-post"
                            className="rounded-t-3xl rounded-b-lg"
                        />
                    </section>
                    <section className="w-full p-5 flex-1 xl:min-w-620">
                        <aside className="flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <a 
                                    href={`${pinDetail.image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e)=> e.stopPropagation()}
                                    className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                                {pinDetail.destination.slice(8)}
                            </a>
                        </aside>
                        <aside>
                            <h1 className="text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
                            <p className="mt-3">
                                {pinDetail.about}
                            </p>
                        </aside>
                        <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                        <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={pinDetail.postedBy?.image}
                        alt="user-profile"
                        />
                        <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
                    </Link>
                    <h2 className="mt-5 text-2xl">
                        Comments
                    </h2>
                    <div className="mx-h-370 overflow-y-auto">
                        {pinDetail?.comments?.map((comment, i)=>{
                            return (
                            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                                <img
                                    src={comment.postedBy.image} alt="user-profile"
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                />
                                <div className="flex flex-col">
                                    <p className="font-bold">
                                        {comment.postedBy.userName}
                                    </p>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-wrap mt-6 gap-3">
                    <Link to={`/user-profile/${pinDetail.postedBy?._id}`} >
                        <img
                        className="w-10 h-10 rounded-full cursor-pointer"
                        src={pinDetail.postedBy?.image}
                        alt="user-profile"
                        />
                    </Link>
                    <input
                        type="text"
                        className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                    />
                    <button
                        type="button"
                        className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none "
                        onClick={postComment}
                    >
                        {addingComment? "Posting...": "Post"}
                    </button>
                    </div>
                    </section>
                </main>
            )}
        {pins?.length > 0 && (
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
            </h2>
        )}
      {pins ? (
            <MasonryLayout pins={pins} />
        ) : (
            <Spinner message="Loading more pins" />
        )}
    </>
  );
};

 
export default PinDetail;
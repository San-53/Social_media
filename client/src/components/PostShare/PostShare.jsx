import React, { useState, useRef } from 'react'
import './PostShare.css'

import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimesCircle } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/uploadAction';

const PostShare = () => {
    const loading = useSelector((state)=>state.postReducer.uploading)
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    const dispatch = useDispatch();
    const desc = useRef();
    // const name = useRef();
    const { user } = useSelector((state) => state.authReducer.authData)
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  //const ProfilePage = false;
    
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(img);
        }
    };
    const reset =()=>{
        setImage(null);
        desc.current.value=""
    }
    const handleSubmit = (e) => {
        e.preventDefault(); // as we don't want to redirect to any other page

        const newPost = {
            userId: user._id,
            desc: desc.current.value,
            userName: user.firstname
        }

        if(image){
            const data = new FormData()
            const filename = Date.now() + image.name;
            // const uName = image.userName;
            data.append("name",filename); 
            data.append("file",image);
            // data.append("user",uName);
            newPost.image = filename;
            console.log(newPost);
            try {
                dispatch(uploadImage(data))
            } catch (error) {
                console.log(error)
            }
        }

        dispatch(uploadPost(newPost))
        reset()
    }

    return (
        <div className="PostShare">
            <img src={user.profilePicture ? serverPublic + user.profilePicture : serverPublic + "defaultProfile.png"} alt="" />

            <div>
                <input ref={desc} required type="text" placeholder="What's happening......" />

                <div className="postOptions">

                    <div className="option" style={{ color: "var(--photo)" }}
                        onClick={() => imageRef.current.click()}>
                        <UilScenery />
                        Photo
                    </div>
                    <div className="option" style={{ color: "var(--video)" }} 
                        onClick={() => imageRef.current.click()}>
                        <UilPlayCircle />
                        Video
                    </div>
                    <div className="option" style={{ color: "var(--location)" }}>
                        <UilLocationPoint />
                        Location
                    </div>
                    <div className="option" style={{ color: "var(--schedule)" }}>
                        <UilSchedule />
                        Schedule
                    </div>
                    <button className="button ps-button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading? "Uploading..." : "Share"}
                    </button>
                    <div style={{ display: "none" }}>
                        <input type="file" name='myImage' ref={imageRef} onChange={onImageChange} />
                    </div>
                </div>

                {image &&

                    <div className="previewImage">
                        <div>
                        <UilTimesCircle onClick={() => setImage(null)} />
                        </div>
                        <img src={URL.createObjectURL(image)} alt="" />
                    </div>
                }

            </div>

        </div>

    )
}

export default PostShare
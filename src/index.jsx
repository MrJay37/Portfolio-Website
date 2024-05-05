import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { urlFor } from './lib/sanityClient';

import { Header } from './components';
import { 
    About,
    Contact, 
    Education, 
    Music,
    Software,
    Work
} from './modules';

import { sanityClient } from './lib/sanityClient';

import "./styles/global.scss"

const App = () => {
    const [members, setMembers] = useState(null)
    const [aboutData, setAboutData] = useState(null)

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {
                    setMembers(res.members)
                    setAboutData(res.intro[0])
                })
        }
        else{
            sanityClient
                .fetch(`*[_type == "members"]`)
                .then((data) => setMembers(data))
                .catch(console.error)
                .then(() => {
                    sanityClient
                    .fetch(`*[_type == "about"]{
                        title,
                        favMeme,
                        skills,
                        bannerPic,
                        intro,
                        resume,
                        myPic,
                        "resumeURL": resume.asset->url
                    }`)
                    .then((data) => setAboutData(data[0]))
                }).catch(console.error);
        }   
    }, [])

    if (!members || !aboutData) return <></>

    return <>
        <Header />
        <About aboutData={aboutData}/>
        <Education />
        <Work />
        <Software members={members} />
        <Music members={members}/>
        <Contact 
            members={members} 
            resume={aboutData.resumeURL} 
            meme={urlFor(aboutData.favMeme).url()}
        />
    </>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    }
])

ReactDOM
    .createRoot(document.getElementById('root'))
    .render(<RouterProvider router={router} />);

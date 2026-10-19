import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { fetchAppData, urlFor } from './lib/sanityClient';

import { Header } from './components';
import { 
    About,
    Contact, 
    Education, 
    Music,
    Software,
    Work
} from './modules';

import "./styles/global.scss"

const App = () => {
    const [members, setMembers] = useState(null)
    const [aboutData, setAboutData] = useState(null)

    useEffect(() => {
        fetchAppData()
            .then(({ members: membersData, about: aboutData }) => {
                setMembers(membersData)
                setAboutData(aboutData)
            })
            .catch(console.error)
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

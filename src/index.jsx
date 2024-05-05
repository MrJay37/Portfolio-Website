import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

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

    const [meme, setMeme] = useState(null)
    const [resume, setResume] = useState(null)

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {setMembers(res.members)})
        }  
        else{
            sanityClient
                .fetch(`*[_type == "members"]`)
                .then((data) => setMembers(data))
                .catch(console.error); 
        }   
    }, [])

    if (!members) return <></>

    return <>
        <Header />
        <About setMeme={setMeme} setResume={setResume} />
        <Education />
        <Work />
        <Software members={members} />
        <Music members={members}/>
        <Contact members={members} resume={resume} meme={meme}/>
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

import { useState } from "react";
import './contact.scss'
import {AiFillGithub, AiFillLinkedin, AiFillYoutube, AiFillInstagram} from 'react-icons/ai'

function Notification({ showNotification, message, error=false}) {
    const classNames = ['notification'] 
    
    if (error) classNames.push('error_background')
    else classNames.push('success_background')

    return showNotification 
        ? <div className={classNames.join(' ')}>{message}</div>
        : <></>
}

function DocItem({ text, url, docButtonText }) {
    return <div className={'ccddbdItem'}>
        <div className={'ccddbdiText'}>{text}</div>
        <div className={'ccddbdiBtn flex'}>
            <a target="_blank" rel="noreferrer" href={url}>{docButtonText}</a>
        </div>
    </div>
}

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function Contact(){
    // Form
    const [values, setValues] = useState({})

    // Validation
    const [error, setError] = useState({})

    // Notification
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState(null)

    // Loading
    const [waiting, setWaiting] = useState(false)

    const sendMessage = async (evt) => {
        setShowNotification(false)
        evt.preventDefault()

        let errObj = {}
        
        if (!values.name || values.name.trim() === "") errObj.name = 'Enter valid name'

        if (!values.email || values.email.trim() === '' || !values.email.trim().match(EMAIL_REGEX)) 
            errObj.email = 'Enter valid email'

        if (!values.message || values.message.trim() === '') errObj.message = 'Enter proper message'

        if (Object.keys(errObj).length > 0) {
            setError(errObj)
            return
        }

        setWaiting(true)
        let res = await fetch(
            process.env.REACT_APP_FORM_API_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }
        )
        let data = await res.json()
        setWaiting(false)
        let res_message = JSON.parse(data['body'])
        
        setNotificationMessage(res_message['message'])
        setValues({})

        setShowNotification(true)
        
        setTimeout(() => {
            setShowNotification(false)
            setTimeout(() => {
                setError(false)
            }, 300);
        }, 5000);
    }

    return <div className={'contactContainer section'} id='contact'>
        <div className="sectionTitle">Contact</div>
        <Notification message={notificationMessage} error={error} showNotification={showNotification}/>
        <div className={'contactGreeting'}>
            Thank you for visiting my website! Leave me a message if you have any questions!
        </div>
        <div className={'contactContent sectionContainer'}>
            <form className={'ccContactForm'} onSubmit={sendMessage}>
                <div className={'cccfItem'}>
                    <label 
                        htmlFor={"contactFormName"} 
                        className={'cccfiLabel'}>
                        Name
                    </label>
                    <input 
                        id={"contactFormName"} 
                        className={'cccfiField'} 
                        placeholder="What can I call you?" 
                        onChange={({ target: { value }}) => setValues({...values, name: value})} 
                        value={values.name || ''} 
                    />
                    {error.name ? <span>{error.name}</span>: <></>}
                </div>
                <div className={'cccfItem'}>
                    <label 
                        htmlFor={'contactFormName'} 
                        className={'cccfiLabel'}
                    >
                        Email
                    </label>
                    <input 
                        id="contactFormName" 
                        className={'cccfiField'} 
                        placeholder="I'll reply back on this" 
                        onChange={({ target: { value }}) => setValues({...values, email: value})} 
                        value={values.email || ''} 
                    />
                    {error.email ? <span>{error.email}</span>: <></>}
                </div>
                <div className={'cccfItem'}>
                    <label 
                        htmlFor={'contactFormName'} 
                        className={'cccfiLabel'}
                    >
                        Message
                    </label>
                    <textarea 
                        id="contactFormName" 
                        className={'cccfiTextarea'} 
                        onChange={({ target: { value }}) => setValues({...values, message: value})} 
                        value={values.message || ''} 
                    />
                    {error.message ? <span>{error.message}</span>: <></>}
                </div>
                {!waiting ? <button className={'cccfSubmitBtn'} type='submit'>
                    Send
                </button> : <></>}
            </form>
            <div className={'ccDocuments'}>
                <div className={'ccdDocBox'}>
                    <div className={'ccddbDocs'}>
                        <DocItem 
                            text={'Download my resume here!'} 
                            url="https://drive.google.com/file/d/1Qmynu9CUW_dn51qo57UTkNlVMEoTerkp/view?usp=share_link"
                            docButtonText={'Resume'}
                        />
                        <DocItem 
                            text={'Download my favorite meme here!'} 
                            url="https://drive.google.com/file/d/1mKdCEgv2kd6w902U6iIdmFRmRnhWiyFh/view?usp=sharing"
                            docButtonText={'Meme'}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className={'contactFooter flex alignCenter'}>
            <div className={'cfTrademark'}>
                &#169; 2024 Sanket Jain 
            </div>
            <div className={'cfSocials'}>
                <span><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/sanket-jain-415a606a/"><AiFillLinkedin /></a></span>
                <span><a target="_blank" rel="noreferrer" href="https://github.com/MrJay37"><AiFillGithub/></a></span>
                <span><a target="_blank" rel="noreferrer" href="https://www.youtube.com/channel/UC4QOttreVJ4zN6W1uBjtHIQ"><AiFillYoutube /></a></span>
                <span><a target="_blank" rel="noreferrer" href="https://www.instagram.com/abagauss/"><AiFillInstagram /></a></span>
            </div>
        </div>
    </div>
}

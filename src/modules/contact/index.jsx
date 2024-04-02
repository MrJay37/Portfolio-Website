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
            <a target="_blank" href={url}>{docButtonText}</a>
        </div>
    </div>
}

export default function Contact(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [waiting, setWaiting] = useState(false)

    const sendMessage = async (evt) => {
        setShowNotification(false)
        evt.preventDefault()

        let errors = []
        
        if (name.trim() == ''){
            errors.push('name')
        }

        if (email.trim() == ''){
            errors.push('email')
        }

        if (message.trim() == ''){
            errors.push('message')
        }

        if (errors.length > 0){
            setNotificationMessage('Please provide valid ' + errors.join(', '))
            setError(true) 
        }

        else{
            setWaiting(true)
            let res = await fetch(
                process.env.REACT_APP_FORM_API_URL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'name': name,
                        'email': email,
                        'message': message
                    })
                }
            )
            let data = await res.json()
            setWaiting(false)
            let res_message = JSON.parse(data['body'])
            
            setNotificationMessage(res_message['message'])
            setName('')
            setEmail('')
            setMessage('')
        }

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
                        onChange={evt => setName(evt.target.value)} 
                        value={name} 
                    />
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
                        onChange={evt => setEmail(evt.target.value)} 
                        value={email} 
                    />
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
                        onChange={evt => setMessage(evt.target.value)} 
                        value={message} 
                    />
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
        <div className={'contactFooter flex-center-align'}>
            <div className={'cfTrademark'}>
                &#169; 2022 Sanket Jain 
            </div>
            <div className={'cfSocials'}>
                <span><a target="_blank" href="https://www.linkedin.com/in/sanket-jain-415a606a/"><AiFillLinkedin /></a></span>
                <span><a target="_blank" href="https://github.com/MrJay37"><AiFillGithub/></a></span>
                <span><a target="_blank" href="https://www.youtube.com/channel/UC4QOttreVJ4zN6W1uBjtHIQ"><AiFillYoutube /></a></span>
                <span><a target="_blank" href="https://www.instagram.com/abagauss/"><AiFillInstagram /></a></span>
            </div>
        </div>
    </div>
}

import { useState } from "react";
import { AppIcons, EMAIL_REGEX } from "../../lib";
import './contact.scss'


function Notification({ notification={ error: false, message: null}}) {   
    const { error, message } = notification;

    const classNames = ['notification', 'flex', 'justifyCenter', 'alignCenter'] 

    classNames.push(error ? 'errorBG' : 'successBG')

    classNames.push(!!message ? 'showNote' : 'removeNote')

    return <div className={classNames.join(' ')}>{message}</div>
}

function ContactForm() {
    const [values, setValues] = useState({})
    const [error, setError] = useState({})
    const [notification, setNotification] = useState({})
    // Flag needed to trigger animations properly
    const [showNotification, setShowNotification] = useState(false)

    const [waiting, setWaiting] = useState(false)

    const shootNotification = async ({error=false, message=null}) => {
        if (!message) return

        setShowNotification(true)
        setNotification({error, message: message})

        setTimeout(() => {
            setNotification({error, message: null})
            setTimeout(() => {
                setShowNotification(false)
            }, 1000)
        }, 2000)
    }
    
    const sendMessage = async (evt) => {
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

        setError({})

        setWaiting(true)

        fetch(
            process.env.REACT_APP_FORM_API_URL,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values)
            }
        ).then(res => res.json())
        .then(data => {
            data = JSON.parse(data['body'])

            setWaiting(false)

            setValues({})
            shootNotification(data['message'])
        })
        .catch(err => {
            console.error(err)
            setValues({})
            setWaiting(false)
        })
    }

    return <>
        {showNotification && <Notification notification={notification} />}
        <form className={'contactForm fullWidth'} onSubmit={sendMessage}>
        <div className={'formItem flexColumn justifyCenter alignCenter fullWidth'}>
            <label htmlFor="contactFormName" className='formItemLabel fullWidth'>Name</label>
            <input 
                id="contactFormName"
                className='formItemField'
                placeholder="What can I call you?" 
                onChange={({ target: { value }}) => setValues({...values, name: value})} 
                value={values.name || ''} 
            />
            <span className="errorMessage fullWidth">{error.name}</span>
        </div>
        <div className={'formItem flexColumn justifyCenter alignCenter fullWidth'}>
            <label htmlFor='contactFormName' className='formItemLabel fullWidth'>Email</label>
            <input 
                id="contactFormName" 
                className='formItemField' 
                placeholder="I'll reply back on this" 
                onChange={({ target: { value }}) => setValues({...values, email: value})} 
                value={values.email || ''} 
            />
            <span className="errorMessage fullWidth">{error.email}</span>
        </div>
        <div className={'formItem flexColumn justifyCenter alignCenter fullWidth'}>
            <label htmlFor='contactFormName' className='formItemLabel fullWidth'>Message</label>
            <textarea 
                id="contactFormName" 
                className='formItemTextArea'
                onChange={({ target: { value }}) => setValues({...values, message: value})} 
                value={values.message || ''} 
            />
            <span className="errorMessage fullWidth">{error.message}</span>
        </div>
        <button className='formSubmitButton cursorPointer' type='submit' disabled={waiting}>Send</button> 
    </form>
    </>
}

function DocItem({ text, url, docButtonText }) {
    return <div className={'documentItem flexColumn justifyCenter alignCenter'}>
        <div className={'documentTitle'}>{text}</div>
        <a className={'documentButton flex'} target="_blank" rel="noreferrer" href={url}>
            <span>{docButtonText}</span>
        </a>
    </div>
}

function Documents(){
    return <div className={'documents fullWidth'}>
        <div className={'docsInnerBox flexColumn justifyCenter alignCenter'}>
            <div className={'docsContainer fullWidth flexColumn'}>
                <DocItem
                    text='Download my resume here!'
                    docButtonText='Resume'
                    url="https://drive.google.com/file/d/1Qmynu9CUW_dn51qo57UTkNlVMEoTerkp/view?usp=share_link"
                />
                <DocItem 
                    text='Download my favorite meme here!'
                    docButtonText='Meme'
                    url="https://drive.google.com/file/d/1mKdCEgv2kd6w902U6iIdmFRmRnhWiyFh/view?usp=sharing"
                />
            </div>
        </div>
    </div>
}

const Footer = ({ socials }) => {
    return <div className={'contactFooter flex alignCenter'}>
        <div className={'footerLabel'}>&#169; 2024 Sanket Jain</div>
        <div className={'footerSocials'}>
            {socials
            .filter(a => !!a.url)
            .map(({app, url}, a) => <a
                key={a} 
                target="_blank" 
                rel="noreferrer" 
                className="removeTextFormat footerSocial"
                href={url}
            >
                {AppIcons[app.trim()]}
            </a>)}
        </div>
    </div>
}

export default function Contact({ members = [] }){
    const me = (members || []).filter(member => member.name === 'Sanket Jain')[0]

    return <div className={'contactContainer section'} id='contact'>
        <div className="sectionTitle">Contact</div>
        
        <div className="sectionContainer">
            <div className={'contactGreeting'}>
                Thank you for visiting my website! Leave me a message if you have any questions!
            </div>
            <div className={'contactContent fullWidth'}>
                <ContactForm />
                <Documents />
            </div>
            <Footer socials={me.socialMedia} />  
        </div>
    </div>
}

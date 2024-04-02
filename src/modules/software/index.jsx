import './software.scss'
import { useState, useEffect } from 'react'
import { sanityClient } from '../../lib/sanityClient'
import { formatToYearMonth as dtFmt } from '../../lib'
import { CardExpand } from '../../components'

function SoftwareCard({ title, startDate, endDate, tech_stack, picture, description, members }){
    const [open, setOpen] = useState(false)
    
    return <div className={'swCard cardBorder'}>
        <div className={'swcMain'}>
            <div className={'swcmHeader flex-center-align'}>
                <h3>{title}</h3>
                <span>
                    {dtFmt(startDate)} {endDate ? 'to ' + dtFmt(endDate): '(Ongoing)'}
                </span>
            </div>
            <div className={'swcmTechStackTags flex'}>
                {tech_stack.slice(0, 6).map((ts, i) => <span key={i}>{ts}</span>)}
            </div>
        </div>
        <div className={'swcExpand flex-column'}>
            <CardExpand open={open} onClick={() => setOpen(!open)}/>
            {open && <>
                <div className={'swceDivider'}></div>
                <div className={'swceBody flex'}>
                    <div className="swcebImage">
                        <img src={picture} alt={`project`} />
                    </div>
                    <div className={"swcebContent"}>
                        <div className={"swceSection"}>
                            <h4 className={"swcesHeading"}>Project</h4>
                            <p>{description}</p>
                        </div>
                        <div >
                            <h4 className={"swcesHeading"}>Members</h4>
                            {members.map((member, m) => (
                                <a href={member.url} target="_blank" rel="noreferrer" key={m}>
                                    <div className={"swcesMember"}>{member.name}</div>
                                </a>
                            )
                        )}
                        </div>
                    </div>
                </div>
            </> }
        </div>
    </div>
}

export default function Software() {
    const [data, setData] = useState([])

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {setData(res.software)})
        }  
        else{
            sanityClient
                .fetch(
                    `*[_type == "work"]{*}`
                )
                .then((data) => {
                    console.log(data);                   
                })
                .catch(console.error); 
        }    
    }, []);

    return <div className={'swContainer section'} id='software'>
        <div className='sectionTitle'>Software</div>
        <div className={'swList sectionContainer'}>
            {data.map((project, i) => <SoftwareCard key={i} {...project}/>)}
        </div>
    </div>
}

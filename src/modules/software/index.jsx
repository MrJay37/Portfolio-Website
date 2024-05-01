import './software.scss'
import { useState, useEffect } from 'react'
import { sanityClient, urlFor } from '../../lib/sanityClient'
import { formatToYearMonth as dtFmt } from '../../lib'
import { CardExpand } from '../../components'


function SoftwareCard({ title, startDate, endDate, tech_stack, picture, description, members }){
    const [open, setOpen] = useState(false)
    
    return <div className={'swclCard cardBorder'}>
        <div className={'swclcMain'}>
            <div className={'swclcmHeader'}>
                <h3>{title}</h3>
                <span>
                    {dtFmt(startDate)} {endDate ? 'to ' + dtFmt(endDate): '(Ongoing)'}
                </span>
            </div>
            <div className={'swclcmTags flex'}>
                {tech_stack.slice(0, 6).map((ts, i) => <span key={i}>{ts}</span>)}
            </div>
        </div>
        <div className={'swclcExpand fullWidth flex-column'}>
            <CardExpand open={open} onClick={() => setOpen(!open)}/>
            {open && <>
                <div className={'swclceDivider'}></div>
                <div className={'swclceBody'}>
                    <img className='fullWidth swclcebImage' src={picture} alt={`project`} />
                    <div className={"swclcebContent"}>
                        <div className={"swclcebcSection"}>
                            <h4 className={"swclcebcHeading"}>Project</h4>
                            <p>{description}</p>
                        </div>
                        <div>
                            <h4 className={"swclcebcHeading"}>Members</h4>
                            <div className='swclcebchMembers'>
                                {members.filter(m => m).map((member, m) => {
                                    const linkedIn = member.socialMedia.filter(sm => sm.app === 'LinkedIn')[0]['url']

                                    return <a href={linkedIn} target="_blank" rel="noreferrer" key={m}>
                                        <div className={"swclcebchMember"}>{member.name}</div>
                                    </a>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </> }
        </div>
    </div>
}


export default function Software({ members }) {
    const [swData, setSWData] = useState(null)

    useEffect(() => {
        const transformData = data => {
            setSWData(data.map(project => ({
                ...project,
                picture: urlFor(project.picture).url(),
                members: project.members.map(mem => members.filter(m => m._id === mem._ref)[0])
            })))
        }

        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res =>  transformData(res.software))
        }
        else{
            if (swData === null && members !== null ) sanityClient
                .fetch(
                    `*[_type == "software"]{
                        description,
                        links,
                        members,
                        picture,
                        startDate,
                        endDate,
                        title,
                        tech_stack
                    }`
                )
                .then((data) =>  transformData(data))
                .catch(console.error);
        }    
    }, [members, swData]);

    return <div className={'swContainer section'} id='software'>
        <div className='sectionTitle'>Software</div>
        <div className={'swcList sectionContainer'}>
            {(swData || []).map((project, i) => <SoftwareCard key={i} {...project}/>)}
        </div>
    </div>
}

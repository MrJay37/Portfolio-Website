import './software.scss'
import { useState, useEffect } from 'react'
import { sanityClient, urlFor } from '../../lib/sanityClient'
import { formatToYearMonth as dtFmt } from '../../lib'
import { CardExpand } from '../../components'


function SoftwareCard({ title, startDate, endDate, tech_stack, picture, description, members }){
    const [open, setOpen] = useState(false)
    
    return <div className={'softwareCard cardBorderLight'}>
        <div className={'softwareCardFace'}>
            <div className={'softCardHeader'}>
                <h3 className='softProjTitle'>{title}</h3>
                <span className='softProjDates'>
                    {dtFmt(startDate)} {endDate ? 'to ' + dtFmt(endDate): '(Ongoing)'}
                </span>
            </div>
            <div className={'softwareCardTags flex'}>
                {tech_stack.slice(0, 6).map((ts, i) => <span className='softProjTech' key={i}>{ts}</span>)}
            </div>
        </div>
        <div className={'softwareCardExpand fullWidth flex-column'}>
            <CardExpand open={open} onClick={() => setOpen(!open)}/>
            {open && <>
                <div className={'softExpDivider fullWidth'}></div>
                <div className={'softExpBody'}>
                    <img className='fullWidth softwarePic' src={picture} alt={`project`} />
                    <div className={"softwareContent"}>
                        <div className={"softwareDesc"}>
                            <h4 className={"softContHeading"}>Project</h4>
                            <p>{description}</p>
                        </div>
                        <div className='softwareMembers'>
                            <h4 className={"softContHeading"}>Members</h4>
                            <div className='memberNames'>
                                {members.map(({socialMedia, name}, m) => {
                                    const linkedIn = socialMedia.filter(
                                        sm => sm.app === 'LinkedIn'
                                    )[0]

                                    return <a 
                                        href={linkedIn ? linkedIn['url'] : null} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        key={m}
                                        className={"softwareMember removeTextFormat"}
                                    >
                                        {name}
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
            const projects = data.map(project => ({
                ...project,
                picture: urlFor(project.picture).url(),
                members: project.members.map(mem => members.filter(m => m._id === mem._ref)[0])
            }))

            setSWData(projects.sort((a, b) => a.startDate < b.startDate ? 1: -1))
        }

        if (swData === null && members !=null){
            if (process.env.REACT_APP_ENV === 'DEV'){
                fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                    .then(data => data.text())
                    .then(res => JSON.parse(res))
                    .then(res =>  transformData(res.software))
            }
            else{
                sanityClient
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
        }
          
    }, [members, swData]);

    return <div className={'softwareContainer section'} id='software'>
        <div className='sectionTitle'>Software</div>
        <div className={'softwareList sectionContainer'}>
            {(swData || []).map((project, i) => <SoftwareCard key={i} {...project}/>)}
        </div>
    </div>
}

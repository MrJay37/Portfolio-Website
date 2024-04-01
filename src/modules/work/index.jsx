import './work.scss'
import { useState, useEffect } from 'react'
import { formatToYearMonth as dtFmt } from '../../lib'
import { CardExpand } from '../../components'
import { sanityClient } from '../../lib/sanityClient'

function WorkCard({ organization, url, logo, positions}) {
    const [open, setOpen] = useState(false)

    return <div className={'workCard cardBorder'}>
        <div className={'workCardHeader flex'}>
            <img src={logo} className='wchLogo' alt={`${organization}Logo`}/>
            <a href={url} target='_blank' rel="noreferrer" className='wchTitle orgLink'>{organization}</a>
        </div>
        <CardExpand open={open} onClick={() => setOpen(!open)}/>
        {open && (
            <div className={'workCardBody'}>
                <div className={'wcbDivider'} />
                <div className='wPositionCards'>
                    {positions.map(({title, startDate, endDate, duties, location: {state, country}}, px) => (
                        <div key={px} className={'wPositionCard cardBorder'}>
                            <h3 className='wPositionTitle'>{title}</h3>
                            <h4 className='wPositionSubtitle'>{state}, {country}, {dtFmt(startDate)} to {dtFmt(endDate)}</h4>
                            {duties.length > 0 && <ul className='wPositionDuties'>
                                {duties.map((duty, d) => <li key={d}>{duty}</li>)}
                            </ul>}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
}

export default function Work() {
    const [data, setData] = useState([])

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {setData(res.work)})
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
    
    return <div className={'workContainer light_theme_section section'} id='work'>
        <div className='sectionTitle'>Professional Summary</div>
        <div className={'workList sectionContainer'}>
            {data.map(data => <WorkCard {...data} key={data.id} />)}
        </div>
    </div>
}
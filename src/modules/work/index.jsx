import './work.scss'
import { useState, useEffect } from 'react'
import { formatToYearMonth as dtFmt } from '../../lib'
import { CardExpand } from '../../components'
import { sanityClient, urlFor } from '../../lib/sanityClient'

function PositionCard({posName, start, end, duties, location: {state, country}}){
    return <div className={'workPositionCard cardBorder'}>
        <h3 className='posTitle'>{posName}</h3>
        <h4 className='posSubtitle'>{state}, {country}, {dtFmt(start)} to {dtFmt(end)}</h4>
        {duties.length > 0 && <ul className='posDuties'>
            {duties.map((duty, d) => <li key={d}>{duty}</li>)}
        </ul>}
    </div>
}

function WorkCard({ organization, url, logo, positions}) {
    const [open, setOpen] = useState(false)


    return <div className={'workCard cardBorder'}>
        <div className={'workCardHeader'}>
            <a 
                href={url} 
                target='_blank' 
                rel="noreferrer" 
                className='wcHeaderTitle removeTextFormat'
            >
                {organization}
            </a>
            <div className='workCardLogo flex'>
                <img src={logo} alt={`${organization}Logo`} className='cardBorder'/>
            </div>
        </div>
        <CardExpand open={open} onClick={() => setOpen(!open)}/>
        {open && (
            <div className={'workCardBody'}>
                <div className={'workCardDivider'} />
                <div className='workPositions'>
                    {positions.map((pos, px) => <PositionCard {...pos} key={px} />)}
                </div>
            </div>
        )}
    </div>
}


export default function Work() {
    const [data, setData] = useState([])

    useEffect(() => {
        const getEarliestStartDate = org => {
            return new Date(org.positions.sort((a, b) => new Date(a.start) < new Date(b.start) ? 1 : -1)[0].start)
        }
        const transformData = data => {
            const works = data.map(work => ({...work, logo: urlFor(work.logo).url()}))
            
            setData(works.sort((a, b) => getEarliestStartDate(a) < getEarliestStartDate(b) ? 1 : -1))
        }
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => transformData(res.work))
        }  
        else{
            sanityClient
                .fetch(`*[_type == "work"]`)
                .then((data) => transformData(data))
                .catch(console.error); 
        }    
    }, []);
    
    return <div className={'workContainer lightThemeSection section'} id='work'>
        <div className='sectionTitle'>Professional Summary</div>
        <div className={'workList sectionContainer'}>
            {data.map((data, d) => <WorkCard key={d} {...data}  />)}
        </div>
    </div>
}
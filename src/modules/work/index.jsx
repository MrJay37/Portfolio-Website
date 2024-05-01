import './work.scss'
import { useState, useEffect } from 'react'
import { formatToYearMonth as dtFmt } from '../../lib'
import { CardExpand } from '../../components'
import { sanityClient, urlFor } from '../../lib/sanityClient'


function WorkCard({ organization, url, logo, positions}) {
    const [open, setOpen] = useState(false)


    return <div className={'wclCard cardBorder'}>
        <div className={'wclcHeader'}>
            <a href={url} target='_blank' rel="noreferrer" className='wclchTitle orgLink'>{organization}</a>
            <div className='wclchLogo flex'>
                <img src={logo} alt={`${organization}Logo`}/>
            </div>
        </div>
        <CardExpand open={open} onClick={() => setOpen(!open)}/>
        {open && (
            <div className={'wclcBody'}>
                <div className={'wclcbDivider'} />
                <div className='wclcbPositionCards'>
                    {positions.map(({posName, start, end, duties, location: {state, country}}, px) => (
                        <div key={px} className={'wclcbpcCard cardBorder'}>
                            <h3 className='wclcbpccTitle'>{posName}</h3>
                            <h4 className='wclcbpccSubtitle'>{state}, {country}, {dtFmt(start)} to {dtFmt(end)}</h4>
                            {duties.length > 0 && <ul className='wclcbpccDuties'>
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
                .then(res => setData(res.work.map(work => ({...work, logo: urlFor(work.logo)}))))
        }  
        else{
            sanityClient
                .fetch(`*[_type == "work"]`)
                .then((data) => setData(data.map(work => ({...work,  logo: urlFor(work.logo).url()}))))
                .catch(console.error); 
        }    
    }, []);
    
    return <div className={'workContainer lightThemeSection section'} id='work'>
        <div className='sectionTitle'>Professional Summary</div>
        <div className={'wcList sectionContainer'}>
            {data.map((data, d) => <WorkCard key={d} {...data}  />)}
        </div>
    </div>
}
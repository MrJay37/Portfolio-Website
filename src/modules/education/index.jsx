import './education.scss'
import { formatToYearMonth } from '../../lib'
import { fetchEducation } from '../../lib/sanityClient'
import { useEffect, useState } from 'react'

const EducationCard = ({url, endDate, startDate, school, degree, program, location }) => {
    return <div className={'educationCard'} >
        <div className={'eduDates flexColumn'}>
            <div>- {formatToYearMonth(endDate)}</div>    
            <div>- {formatToYearMonth(startDate)}</div>    
        </div>
        <div className={'school'}>
            {url 
                ? <a 
                    href={url} 
                    rel='noreferrer' 
                    target='_blank'
                    className='removeTextFormat'
                >
                    <h1>{school}</h1>
                </a> 
                : <h1>{school}</h1>
            }
            <h3>{degree}</h3>
            <h3>{program}</h3>
            <p>{location.state}, {location.country}</p>
        </div>
    </div>
}


export default function Education() {
    const [educationData, setEducationData] = useState(null)

    useEffect(() => {
        fetchEducation()
            .then(data => {
                data.sort((a, b) => a.startDate < b.startDate ? 1 : -1)
                setEducationData(data)
            })
            .catch(console.error)
    }, []);

    return <div className={'eduContainer section'} id="education">
        <div className={'sectionTitle'}>Education</div>
        <div className={'educationList sectionContainer flex-column'}>
            {(educationData || []).map((education, edx) =>  <EducationCard key={edx} {...education}/>)}
        </div>
    </div>
}

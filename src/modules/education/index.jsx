import './education.scss'
import { formatToYearMonth } from '../../lib'
import { sanityClient } from '../../lib/sanityClient'
import { useEffect, useState } from 'react'


export default function Education() {
    const [educationData, setEducationData] = useState(null)

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {
                    let edu = res.education
                    edu.sort((a, b) => a.startDate < b.startDate ? 1 : -1);
                    setEducationData(edu)
                })
        }  
        else{
            sanityClient
                .fetch(
                    `*[_type == "education"]{
                        school, 
                        startDate,
                        endDate,
                        url, 
                        degree,
                        program, 
                        location
                    }`
                )
                .then((data) => {
                    let edu = data           
                    edu.sort((a, b) => a.startDate < b.startDate ? 1 : -1);
                    setEducationData(edu)
                })
                .catch(console.error)
        }   
    }, []);

    return <div className={'eduContainer section'} id="education">
        <div className={'sectionTitle'}>Education</div>
        <div className={'ecList sectionContainer flex-column'}>
            {(educationData || []).map(({ id, url, endDate, startDate, school, degree, program, location }, edx) => (
                <div className={'eclCard'} key={edx} >
                    <div className={'eclcDates flex-column normal-text'}>
                        <div>- {formatToYearMonth(endDate)}</div>    
                        <div>- {formatToYearMonth(startDate)}</div>    
                    </div>
                    <div className={'eclcSchool'}>
                        {url 
                            ? <a href={url} rel='noreferrer' target='_blank'><h1>{school}</h1></a> 
                            : <h1>{school}</h1>
                        }
                        <h3>{degree}</h3>
                        <h3>{program}</h3>
                        <p>{location.state}, {location.country}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
}

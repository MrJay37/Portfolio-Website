import './education.scss'
import { formatToYearMonth } from '../../lib'
import { sanityClient } from '../../lib/sanityClient'
import { useEffect, useState } from 'react'


export default function Education() {
    const [educationData, setEducationData] = useState([])

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {
                    setEducationData(res.education);
                    
                })
        }  
        else{
            sanityClient
                .fetch(
                    `*[_type == "education"]{
                        url, 
                        endDate, 
                        startDate, 
                        school, 
                        degree,
                        program, 
                        location
                    }`
                )
                .then((data) => {
                    console.log(data);                   
                    setEducationData(data)
                })
                .catch(console.error); 
        }    
    }, []);

    return <div className={'eduContainer section'} id="education">
        <div className={'sectionTitle'}>Education</div>
        <div className={'eduList sectionContainer flex-column'}>
            {educationData.map(({ id, url, endDate, startDate, school, degree, program, location }, edx) => (
                <div className={'eduCard flex'} key={edx} >
                    <div className={'eduDates flex-column normal-text'}>
                        <div>- {formatToYearMonth(endDate)}</div>    
                        <div>- {formatToYearMonth(startDate)}</div>    
                    </div>
                    <div className={'eduSchool flex'}>
                        <div className={'eduText'}>
                            {url ? <a href={url} rel='noreferrer' target='_blank'><h1>{school}</h1></a> : <h1>{school}</h1>}
                            <h3>{degree}</h3>
                            <h3>{program}</h3>
                            <p>{location.state}, {location.country}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
}

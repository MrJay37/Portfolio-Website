import './about.scss'
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { sanityClient, urlFor} from '../../lib/sanityClient'
import { useEffect, useState } from 'react';

ChartJS.register(LinearScale, CategoryScale, BarElement);

ChartJS.defaults.font.size = 16

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [bannerPicUrl, setBannerPicUrl] = useState(null)
    const [myPicUrl, setMyPicUrl] = useState(null)
    const [skills, setSkills] = useState([])

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {
                    setAboutData(res.about);
                    setBannerPicUrl(res.about.bannerPic);
                    setMyPicUrl(res.about.myPic);
                    setSkills(res.about.skills)
                })
        }  
        else{
            sanityClient
                .fetch(
                    `*[_type == "about"]{
                        intro,
                        bannerPic,
                        myPic,
                        skills
                    }`
                )
                .then((data) => {
                    console.log(data[0].skills);
                    setAboutData(data[0]);
                    setBannerPicUrl(urlFor(data[0].bannerPic).url());
                    setMyPicUrl(urlFor(data[0].myPic).url());
                    setSkills(data[0].skills.map(s => ({title: s.technique, value: s.value})));
                })
                .catch(console.error); 
        }    
    }, []);

    return <div className={'aboutContainer light_theme_section section'}>
        <img className={'aboutBanner'} src={bannerPicUrl} alt='banner' />
        <div className={'aboutBannerText flex-center-align'}>
            <h1>Hi! I make music and software</h1>
        </div>
        <div className={'aboutIntro sectionContainer'}>
            <div className={'aboutIntroContainer flex'}>
                <div className={'aboutIntroText flex-column-center-align'}>
                    <h3>Who I Am?</h3>
                    {aboutData && aboutData.intro.split('\n').map((intro, i) => (
                        <p key={i} className={'aboutIntroText normal-text'}>
                            {intro}
                        </p>
                    ))}
                </div>
                <div className={'aboutIntroProfilePicture flex'}>
                    <img src={myPicUrl} alt='me'/>
                </div>
            </div>
            <div className={'aboutIntroBarContainer flex-column-center-align barChart'}>
                <h3>What do I know?</h3>
                <Bar
                    data={
                        {
                            labels: skills.map((s, i) => s.title),
                            datasets: [
                                {
                                    data: skills.map((s, i) => s.value),
                                    backgroundColor: skills.map((s, i) => `rgba(33, 33, 33, ${s.value})`),
                                    borderWidth: 1
                                }
                            ]
                        }
                    } 
                    options={{
                        scales: {
                            y: {
                                display: false
                            }
                        }
                    }}
                />
            </div>
            
        </div>
    </div>
}

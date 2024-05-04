import './about.scss'
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { sanityClient, urlFor} from '../../lib/sanityClient'
import { useEffect, useState } from 'react';

ChartJS.register(LinearScale, CategoryScale, BarElement);

ChartJS.defaults.font.size = 16

const SubTitle = ({ children}) => {
    return <h3 className='introSubTitle'>{children}</h3>
}

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [bannerPicUrl, setBannerPicUrl] = useState(null)
    const [myPicUrl, setMyPicUrl] = useState(null)

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {
                    setAboutData(res.intro[0]);
                    setBannerPicUrl(urlFor(res.intro[0].bannerPic).url());
                    setMyPicUrl(urlFor(res.intro[0].myPic).url());
                })
        }  
        else{
            sanityClient
                .fetch(`*[_type == "about"]`)
                .then((data) => {
                    setAboutData(data[0]);
                    setBannerPicUrl(urlFor(data[0].bannerPic).url());
                    setMyPicUrl(urlFor(data[0].myPic).url());
                })
                .catch(console.error); 
        }    
    }, []);

    return <div className={'aboutContainer lightThemeSection section'}>
        <img className={'banner'} src={bannerPicUrl} alt='banner' />
        <div className={'greeting flex alignCenter'}>
            <h1 className='introSubTitle'>Hi! I make music and software</h1>
        </div>
        <div className={'aboutContent sectionContainer'}>
            <div className={'intro flex'}>
                <div className={'introText flex-column-center-align'}>
                    <SubTitle>Who I Am?</SubTitle>
                    {aboutData && aboutData.intro.split('\n').map((intro, i) => (
                        <p key={i} className={'aciText'}>
                            {intro}
                        </p>
                    ))}
                </div>
                <div className={'introPicture fullWidth flex alignCenter'}>
                    <img src={myPicUrl} alt='me'/>
                </div>
            </div>
            <div className={'introCharContainer flex-column-center-align'}>
                <SubTitle>What do I know?</SubTitle>
                <Bar
                    data={{
                        labels: ((aboutData || {}).skills || []).map((s, i) => s.technique),
                        datasets: [{
                            data: ((aboutData || {}).skills || []).map((s, i) => s.value),
                            backgroundColor: ((aboutData || {}).skills || []).map((s, i) => (
                                `rgba(33, 33, 33, ${s.value})`
                            )),
                            borderWidth: 1
                        }]
                    }} 
                    options={{scales: {y: { display: false }}}}
                />
            </div>
            
        </div>
    </div>
}

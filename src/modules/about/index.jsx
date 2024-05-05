import './about.scss'
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { urlFor} from '../../lib/sanityClient'

ChartJS.register(LinearScale, CategoryScale, BarElement);

ChartJS.defaults.font.size = 16

const SubTitle = ({ children }) => {
    return <h3 className='introSubTitle'>{children}</h3>
}

export default function About({ aboutData }) {
    return <div className={'aboutContainer lightThemeSection section'}>
        <img className={'banner'} src={urlFor(aboutData.bannerPic).url()} alt='banner' />
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
                    <img src={urlFor(aboutData.myPic).url()} alt='me'/>
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

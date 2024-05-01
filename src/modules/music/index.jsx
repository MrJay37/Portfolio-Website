import './music.scss'
import { CardExpand } from '../../components'
import { useState, useEffect } from 'react'
import { AiFillYoutube, AiFillInstagram} from 'react-icons/ai'
import { sanityClient, urlFor } from '../../lib/sanityClient'


const appIcons = {
    'YouTube': <AiFillYoutube />,
    'Instagram': <AiFillInstagram />
}

function MusicCard({ count, img, title, genres, members, projects}){
    const [open, setOpen] = useState(false)
    const card_dir = count % 2 === 1 ? 'right' : 'left'

    return <div className={'mclCard cardBorder'}>
        <div className={'mclcHeader flex ' + card_dir + 'Grid'}>
            <img className={'mclchPoster'} src={img} alt='groupPic'/>
            <div className={'muclchText flex-column'}>
                <h3>{title}</h3>
                <div className={'muclchtTagContainer flex normal-text card' }>
                    {genres && genres.slice(0, 4).map((genre, g) => (
                        <div className={'muclchttcTag'} key={g}>{genre}</div>
                    ))}
                </div>
                <CardExpand open={open} onClick={() => setOpen(!open)} style={{margin: "20px 0"}}/>
            </div>
        </div>
        {
            open && <div className={'muclcExpand'}>
                <h1>Members</h1>
                <div className={'muclceMembers flex'}>
                    {members.map((member, m) => <div className={'muclcemMember flex-column'} key={m}>
                        <h4>
                            {member.name}
                        </h4>
                        <div className={'muclcemmArtForms flex-column'}>
                            {member.artForms.map((af, a) => <span key={a}>{af}</span>)}
                        </div>
                        <div className={'muclcemmLinks flex'}>
                            {member.socialMedia
                                .filter(sm => ['YouTube', 'Instagram'].includes(sm.app.trim()))
                                .map((sm, s) => <a key={s} rel='noreferrer' href={sm.url} target="_blank">{appIcons[sm.app.trim()]}</a>)}
                        </div>
                    </div>)}
                </div>
                <div className={'muclceDivide'} />
                <h1>Projects</h1>
                <div className={'muclceProjects flex-column'}>
                    {projects.map((project, p) => {
                        return <div className={'muclcepProject'} key={p}>
                            <div className={'muclceppEmbed flex'} dangerouslySetInnerHTML={{__html: project.embed}}></div>
                            <div className={'muclceppTitle'}>{project.title}</div>
                            <div className={'muclceppGenre'}>{project.genres.join(' | ')}</div>
                        </div>
                    })}
                </div>
            </div>
        }
    </div>
}


export default function Music({ members }) {
    const [musicData, setMusicData] = useState(null);

    useEffect(() => {
        const transformData = data => setMusicData(data.map(project => ({
            ...project,
            img: urlFor(project.img).url(),
            members: project.members.map(mem => members.filter(m => mem._ref === m._id)[0])
        })
        ))

        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => transformData(res.music))
        }  
        else{
            sanityClient
                .fetch(`*[_type == "music"]`)
                .then((data) => transformData(data))
                .catch(console.error); 
        }
    }, [members]);

    return <div className={'musicContainer section lightThemeSection'} id='music'>
        <div className='sectionTitle'>Music</div>
        <div className={'mcList sectionContainer'}>
            {(musicData || []).map((props, i) => <MusicCard {...props} count={i} key={i}/>)}
        </div>
    </div>
}

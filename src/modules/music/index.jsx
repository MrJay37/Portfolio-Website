import './music.scss'
import { CardExpand } from '../../components'
import { useState, useEffect } from 'react'
import { AiFillYoutube, AiFillInstagram} from 'react-icons/ai'
import { sanityClient } from '../../lib/sanityClient'


const appIcons = {
    'YouTube': <AiFillYoutube />,
    'Instagram': <AiFillInstagram />
}

function MusicCard({ count, img, title, genres, members, projects}){
    const [open, setOpen] = useState(false)
    const card_dir = count % 2 === 1 ? 'Right' : 'Left'
    const opp_card_dir = count % 2 === 1 ?  'Left' : 'Right'

    return <div className={'muclCard cardBorder'}>
        <div className={'muclcHeader flex card' + card_dir}>
            <img className={'muclchPoster'} src={img}/>
            <div className={'muclchText flex-column card' + card_dir + 'Align'}>
                <h3>{title}</h3>
                <div className={'muclchtTagContainer' + ' flex normal-text card' + opp_card_dir }>
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
                        <div className={'muclcemmArtForms' + ' flex-column'}>
                            {member.artForms.map((af, a) => <span key={a}>{af}</span>)}
                        </div>
                        <div className={'muclcemmLinks' + ' flex'}>
                            {member.socialMedia.map((sm, s) => <a key={s} href={sm.url} target="_blank">{appIcons[sm.app]}</a>)}
                        </div>
                    </div>)}
                </div>
                <div className={'muclceDivide'} />
                <h1>Projects</h1>
                <div className={'muclceProjects flex-column'}>
                    {projects.map((project, p) => (
                        <div className={'muclcepProject'} key={p}>
                            <div className={'muclceppEmbed flex'} dangerouslySetInnerHTML={{__html: project.embed}}></div>
                            <div className={'muclceppTitle'}>{project.title}</div>
                            <div className={'muclceppGenre'}>{project.genre.join(' | ')}</div>
                        </div>
                    ))}
                </div>
            </div>
        }
    </div>
}


export default function Music() {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV'){
            fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
                .then(data => data.text())
                .then(res => JSON.parse(res))
                .then(res => {
                    setData(res.music.map(m => ({
                        ...m,
                        members: m.members.map(mId => res.members.filter(member => member.id === mId)[0])
                    })))
                })
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

    return <div className={'musicContainer section light_theme_section'} id='music'>
        <div className='sectionTitle'>Music</div>
        <div className={'mucList sectionContainer'}>
            {(data || []).map((props, i) => <MusicCard {...props} count={i} key={i}/>)}
        </div>
    </div>
}

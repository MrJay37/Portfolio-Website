import './music.scss'
import { CardExpand } from '../../components'
import { useState, useEffect } from 'react'
import { AiFillYoutube, AiFillInstagram} from 'react-icons/ai'
import { sanityClient, urlFor } from '../../lib/sanityClient'


const appIcons = {
    'YouTube': <AiFillYoutube />,
    'Instagram': <AiFillInstagram />
}

function ArtistCard({ name, artForms, socialMedia }) {
    return <div className={'artistCard'}>
        <span className='artistName'>{name}</span>
        <div className={'artForms flexColumn alignCenter justifyCenter'}>
            {artForms.map((af, a) => <span key={a}>{af}</span>)}
        </div>
        <div className={'artistLinks flex'}>
            {socialMedia
                .filter(sm => ['YouTube', 'Instagram'].includes(sm.app.trim()))
                .map((sm, s) => <a 
                    key={s} 
                    rel='noreferrer' 
                    href={sm.url} 
                    target="_blank"
                    className='removeTextFormat'
                >
                    {appIcons[sm.app.trim()]}
                </a>)}
        </div>
    </div>
}

const ProjectCard = ({ embed, title, genres}) => {
    return <div className={'musicProjectCard fullWidth'}>
        <div className={'musicProjectEmbed flex fullWidth'} dangerouslySetInnerHTML={{__html: embed}}></div>
        <div className={'musicProjectTitle'}>{title}</div>
        <div className={'musicProjectGenre'}>{genres.join(' | ')}</div>
    </div>
}

function MusicCard({ count, img, title, genres, members, projects}){
    const [open, setOpen] = useState(false)
    const card_dir = count % 2 === 1 ? 'right' : 'left'

    return <div className={'cardBorder musicCard'}>
        <div className={'musicCardHeader flex ' + card_dir + 'Grid'}>
            <img className={'musicGroupPic'} src={img} alt='groupPic'/>
            <div className={'musicGroupIntro flexColumn'}>
                <h3 className='musicGroupTitle'>{title}</h3>
                <div className={'musicGroupGenres flex card' }>
                    {genres && genres.slice(0, 4).map((genre, g) => (
                        <div className={'mgGenreTag'} key={g}>{genre}</div>
                    ))}
                </div>
                <CardExpand open={open} onClick={() => setOpen(!open)} style={{margin: "20px 0"}}/>
            </div>
        </div>
        {open && <div className={'musicCardExpand'}>
            <h1 className='mcExpTitle'>Members</h1>
            <div className={'artists fullWidth flex justifyCenter'}>
                {members.map((member, m) => <ArtistCard key={m} {...member} />)}
            </div>
            <h1 className='mcExpTitle'>Projects</h1>
            <div className={'musicProjects flexColumn fullWidth'}>
                {projects.map((project, p) => <ProjectCard key={p} {...project} />)}
            </div>
        </div>}
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
        <div className={'musicList sectionContainer'}>
            {(musicData || []).map((props, i) => <MusicCard {...props} count={i} key={i}/>)}
        </div>
    </div>
}

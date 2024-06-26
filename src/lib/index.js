import {AiFillGithub, AiFillLinkedin, AiFillYoutube, AiFillInstagram} from 'react-icons/ai'

const months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
}

export const formatToYearMonth = (date_obj, includeDay=false) => {
    if (!date_obj) return 'now';

    let year, month, day;

    try{
        [month, day, year] = date_obj.toLocaleDateString().split('/')

    } catch(e){
        if (e.name === 'TypeError'){
            [year, month, day] = date_obj.split('T')[0].split('-');
        }
        else throw e    
    }

    
    if (!includeDay) return `${year} ${months[parseInt(month)]}`
    else return `${year} ${months[parseInt(month)]} ${day}`
}

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const AppIcons = {
    'YouTube': <AiFillYoutube />,
    'Instagram': <AiFillInstagram />,
    'GitHub': <AiFillGithub />,
    'LinkedIn': <AiFillLinkedin />
}
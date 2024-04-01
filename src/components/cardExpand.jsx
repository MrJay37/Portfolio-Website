import { SlArrowUp, SlArrowDown } from 'react-icons/sl'

export default function CardExpand({ onClick, open }){
    return <div className='switch' onClick={onClick}>
        {open ? <SlArrowUp />: <SlArrowDown />}
    </div>
}

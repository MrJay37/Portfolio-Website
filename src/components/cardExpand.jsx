import { SlArrowUp, SlArrowDown } from 'react-icons/sl'

export default function CardExpand({ onClick, open }){
    return <div 
        className='cursorPointer fullWidth' 
        onClick={onClick} 
        style={{textAlign: 'center'}}
    >
        {open ? <SlArrowUp />: <SlArrowDown />}
    </div>
}

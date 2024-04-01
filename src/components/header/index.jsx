import { useState } from 'react'
import './header.scss'
import HambugerButton from '../hamburgerIcon'

const menu = [
	{
		id: 'education',
		displayText: 'Education',
		to: '#education'
	},
	{
		id: 'work',
		displayText: 'Work',
		to: '#work'
	},
	{
		id: 'software',
		displayText: 'Software',
		to: '#software'
	},
	{
		id: 'music',
		displayText: 'Music',
		to: '#music'
	},
	{
		id: 'contact',
		displayText: 'Contact',
		to: '#contact'
	}
]


function NavigationGroup() {
	return <div className={'navigationMenu flex'}>
		{menu.map(({to, displayText, id}) => (
			<a key={id} href={to} className="navigationMenuOption headerLink">
				{displayText}
			</a>
		))}
	</div>
}

function DrawerNavigation({ onClick }) {
	return <div className={'navigationDrawer flex-column'}>
		{menu.map(({to, displayText, id}) => (
            <a key={id} href={to} className="navigationMenuOption headerLink" onClick={onClick} >
                {displayText}
            </a>
		))}
    </div>
}

export default function Header() {
    
	const [drawer, showDrawer] = useState(false)

	const closeDrawer = () => showDrawer(!drawer)

	return <div className={'headerContainer flex-center-align fullWidth'}>
		<div className={'headerContent flex-center-align fullWidth'}>
			<a className={"headerAvatar headerLink"} href='/'>Sanket Jain</a>
			<NavigationGroup />
			<span className={'headerDrawerButton'}>
				<HambugerButton clicked={drawer} onClick={closeDrawer}/>
			</span>
			{drawer ? <DrawerNavigation onClick={closeDrawer} /> : <></>}
		</div>
	</div>
}
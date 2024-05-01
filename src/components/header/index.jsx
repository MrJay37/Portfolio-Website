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
	return <div className={'hccNavMenu flex'}>
		{menu.map(({ to, displayText, id }) => (
			<a key={id} href={to} className="hccnNavMenuOption headerLink">
				{displayText}
			</a>
		))}
	</div>
}

function DrawerNavigation({ onClick }) {
	return <div className='hccNavDrawer' onClick={onClick} >
		<div className={'hccndOptions fullWidth flex-column'}>
			{menu.map(({ to, displayText, id }) => (
				<a key={id} href={to} className="hccnNavMenuOption headerLink" >
					{displayText}
				</a>
			))}
		</div>
	</div>
}

export default function Header() {
	const [drawer, showDrawer] = useState(false)

	const closeDrawer = () => showDrawer(!drawer)

	return <div className={'headerContainer flex alignCenter fullWidth'}>
		<div className={'hcContent flex alignCenter fullWidth'}>
			<a className={"hccAvatar flex headerLink"} href='/'>Sanket Jain</a>
			<NavigationGroup />
			<span className={'hccDrawerButton'}>
				<HambugerButton clicked={drawer} onClick={closeDrawer} />
			</span>
			{drawer ? <DrawerNavigation onClick={closeDrawer} /> : <></>}
		</div>
	</div>
}
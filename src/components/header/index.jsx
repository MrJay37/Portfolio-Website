import { useState } from 'react'
import HambugerButton from '../hamburgerIcon'

import './header.scss'

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
	return <div className={'headerNavMenu flex'}>
		{menu.map(({ to, displayText, id }) => (
			<a key={id} href={to} className="navMenOpt removeTextFormat">{displayText}</a>
		))}
	</div>
}

function DrawerNavigation({ onClick }) {
	return <div className='headerNavDrawer' onClick={onClick} >
		<div className={'navDrawerMenu fullWidth flexColumn'}>
			{menu.map(({ to, displayText, id }) => (
				<a key={id} href={to} className="navDrawerMenOpt removeTextFormat" >
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
		<div className={'headerContent flex alignCenter fullWidth'}>
			<a className={"headerAvatar flex removeTextFormat"} href='/'>Sanket Jain</a>
			<NavigationGroup />
			<span className={'headerDrawerBtn'}>
				<HambugerButton clicked={drawer} onClick={closeDrawer} />
			</span>
			{drawer ? <DrawerNavigation onClick={closeDrawer} /> : <></>}
		</div>
	</div>
}